interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  SESSION_TTL_SECONDS?: string;
}

type SessionPayload = { sub: string; exp: number; iat: number };
type ProductInput = {
  title: string;
  subtitle: string;
  type: "bot" | "item";
  category: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  tone: "violet" | "blue" | "orange" | "pink" | "green" | "cyan";
  active: boolean;
};

const encoder = new TextEncoder();
const allowedTones = new Set(["violet", "blue", "orange", "pink", "green", "cyan"]);
const noStoreHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const json = (body: unknown, status = 200, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...noStoreHeaders, ...extra } });

const errorResponse = (status: number, code: string) => json({ error: code }, status);

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmac(value: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return difference === 0;
}

async function createSession(email: string, env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const configuredTtl = Number(env.SESSION_TTL_SECONDS ?? 28_800);
  const ttl = Number.isFinite(configuredTtl) ? Math.min(Math.max(configuredTtl, 900), 86_400) : 28_800;
  const payload: SessionPayload = { sub: email.toLowerCase(), iat: now, exp: now + ttl };
  const encoded = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  return `${encoded}.${bytesToBase64Url(await hmac(encoded, env.SESSION_SECRET))}`;
}

async function verifySession(request: Request, env: Env): Promise<SessionPayload | null> {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice(7);
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return null;
  const expected = await hmac(encoded, env.SESSION_SECRET);
  let provided: Uint8Array<ArrayBuffer>;
  try {
    provided = base64ToBytes(signature);
  } catch {
    return null;
  }
  if (!constantTimeEqual(expected, provided)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64ToBytes(encoded))) as SessionPayload;
    if (payload.sub !== env.ADMIN_EMAIL.trim().toLowerCase() || !Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, iterationsText, saltText, expectedText, extra] = encodedHash.split("$");
  const iterations = Number(iterationsText);
  if (algorithm !== "pbkdf2_sha256" || extra || !Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) return false;
  try {
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: base64ToBytes(saltText), iterations }, key, 256));
    return constantTimeEqual(actual, base64ToBytes(expectedText));
  } catch {
    return false;
  }
}

async function requestKey(request: Request, env: Env): Promise<string> {
  const address = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const digest = await hmac(`login:${address}`, env.SESSION_SECRET);
  return bytesToBase64Url(digest).slice(0, 40);
}

async function isRateLimited(key: string, env: Env): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT blocked_until FROM login_attempts WHERE key = ?1").bind(key).first<{ blocked_until: number }>();
  return Boolean(row && row.blocked_until > now);
}

async function recordLoginFailure(key: string, env: Env): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT attempts, window_start FROM login_attempts WHERE key = ?1").bind(key).first<{ attempts: number; window_start: number }>();
  const insideWindow = Boolean(row && row.window_start > now - 900);
  const attempts = insideWindow ? row!.attempts + 1 : 1;
  const windowStart = insideWindow ? row!.window_start : now;
  const blockedUntil = attempts >= 5 ? now + 900 : 0;
  await env.DB.batch([
    env.DB.prepare("DELETE FROM login_attempts WHERE window_start < ?1").bind(now - 86_400),
    env.DB.prepare("INSERT INTO login_attempts (key, attempts, window_start, blocked_until) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(key) DO UPDATE SET attempts = excluded.attempts, window_start = excluded.window_start, blocked_until = excluded.blocked_until")
      .bind(key, attempts, windowStart, blockedUntil),
  ]);
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const declaredLength = Number(request.headers.get("Content-Length") ?? 0);
  if (declaredLength > 16_384) return null;
  try {
    const text = await request.text();
    if (encoder.encode(text).byteLength > 16_384) return null;
    const body = JSON.parse(text);
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function cleanText(value: unknown, minimum: number, maximum: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/[\u0000-\u001F\u007F]/g, "");
  return normalized.length >= minimum && normalized.length <= maximum ? normalized : null;
}

function validateProduct(body: Record<string, unknown>): ProductInput | null {
  const title = cleanText(body.title, 2, 100);
  const subtitle = cleanText(body.subtitle ?? "", 0, 240);
  const category = cleanText(body.category, 2, 80);
  const type = body.type === "bot" || body.type === "item" ? body.type : null;
  const tone = typeof body.tone === "string" && allowedTones.has(body.tone) ? body.tone as ProductInput["tone"] : null;
  const price = Number(body.price);
  const oldPrice = body.old_price === null || body.old_price === "" || body.old_price === undefined ? null : Number(body.old_price);
  const badge = body.badge === null || body.badge === "" || body.badge === undefined ? null : cleanText(body.badge, 1, 30);
  if (!title || subtitle === null || !category || !type || !tone || !Number.isSafeInteger(price) || price < 0 || (oldPrice !== null && (!Number.isSafeInteger(oldPrice) || oldPrice < price)) || (body.badge != null && body.badge !== "" && badge === null) || typeof body.active !== "boolean") return null;
  return { title, subtitle, category, type, tone, price, old_price: oldPrice, badge, active: body.active };
}

function serializeProduct(row: Record<string, unknown>) {
  return { ...row, active: Boolean(row.active), price: Number(row.price), old_price: row.old_price === null ? null : Number(row.old_price), rating: Number(row.rating), reviews: Number(row.reviews) };
}

async function listProducts(env: Env, includeInactive: boolean): Promise<Response> {
  const statement = includeInactive
    ? "SELECT * FROM products ORDER BY created_at DESC"
    : "SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC";
  const { results } = await env.DB.prepare(statement).all<Record<string, unknown>>();
  return json({ products: results.map(serializeProduct) }, 200, includeInactive ? {} : { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" });
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const key = await requestKey(request, env);
  if (await isRateLimited(key, env)) return errorResponse(429, "too_many_attempts");
  const body = await readJson(request);
  const email = cleanText(body?.email, 3, 254)?.toLowerCase();
  const password = typeof body?.password === "string" && body.password.length <= 256 ? body.password : "";
  const emailMatches = email === env.ADMIN_EMAIL.trim().toLowerCase();
  const passwordMatches = password ? await verifyPassword(password, env.ADMIN_PASSWORD_HASH) : false;
  if (!emailMatches || !passwordMatches) {
    await recordLoginFailure(key, env);
    return errorResponse(401, "invalid_credentials");
  }
  await env.DB.prepare("DELETE FROM login_attempts WHERE key = ?1").bind(key).run();
  return json({ token: await createSession(email, env) });
}

async function handleAdminProducts(request: Request, env: Env, id: number | null): Promise<Response> {
  if (request.method === "GET" && id === null) return listProducts(env, true);
  if (request.method === "DELETE" && id !== null) {
    const result = await env.DB.prepare("DELETE FROM products WHERE id = ?1").bind(id).run();
    return result.meta.changes ? json({ deleted: true }) : errorResponse(404, "not_found");
  }
  const body = await readJson(request);
  if (!body) return errorResponse(400, "invalid_json");
  let source = body;
  if ((request.method === "PUT" || request.method === "PATCH") && id !== null) {
    const existing = await env.DB.prepare("SELECT * FROM products WHERE id = ?1").bind(id).first<Record<string, unknown>>();
    if (!existing) return errorResponse(404, "not_found");
    source = { ...existing, ...body };
  }
  const product = validateProduct(source);
  if (!product) return errorResponse(422, "invalid_product");
  if (request.method === "POST" && id === null) {
    const result = await env.DB.prepare("INSERT INTO products (title, subtitle, type, category, price, old_price, badge, tone, active) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)")
      .bind(product.title, product.subtitle, product.type, product.category, product.price, product.old_price, product.badge, product.tone, product.active ? 1 : 0).run();
    return json({ id: result.meta.last_row_id }, 201);
  }
  if ((request.method === "PUT" || request.method === "PATCH") && id !== null) {
    await env.DB.prepare("UPDATE products SET title = ?1, subtitle = ?2, type = ?3, category = ?4, price = ?5, old_price = ?6, badge = ?7, tone = ?8, active = ?9, updated_at = unixepoch() WHERE id = ?10")
      .bind(product.title, product.subtitle, product.type, product.category, product.price, product.old_price, product.badge, product.tone, product.active ? 1 : 0, id).run();
    return json({ updated: true });
  }
  return errorResponse(405, "method_not_allowed");
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: noStoreHeaders });
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin && !origin.startsWith("http://localhost:") && !origin.startsWith("http://127.0.0.1:")) return errorResponse(403, "origin_denied");
  if (url.pathname === "/api/health" && request.method === "GET") return json({ ok: true });
  if (url.pathname === "/api/products" && request.method === "GET") return listProducts(env, false);
  if (url.pathname === "/api/admin/login" && request.method === "POST") return handleLogin(request, env);
  if (!url.pathname.startsWith("/api/admin/")) return errorResponse(404, "not_found");
  if (!await verifySession(request, env)) return errorResponse(401, "unauthorized");
  if (url.pathname === "/api/admin/session" && request.method === "GET") return json({ valid: true });
  const match = url.pathname.match(/^\/api\/admin\/products(?:\/(\d+))?$/);
  if (match) return handleAdminProducts(request, env, match[1] ? Number(match[1]) : null);
  return errorResponse(404, "not_found");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/")) return await handleApi(request, env);
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error("Unhandled worker error", error instanceof Error ? error.message : "unknown");
      return errorResponse(500, "internal_error");
    }
  },
};
