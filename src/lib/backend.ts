export type BackendProduct = {
  id: number;
  title: string;
  subtitle: string;
  type: "bot" | "item";
  category: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  tone: "violet" | "blue" | "orange" | "pink" | "green" | "cyan";
  rating: number;
  reviews: number;
  active: boolean;
  created_at: string;
};

export type BackendProductDraft = Omit<BackendProduct, "id" | "rating" | "reviews" | "created_at">;

const useCloudflareBackend = import.meta.env.VITE_BACKEND === "cloudflare";
const workerTokenKey = "botzone_worker_admin_session";

export const isBackendConfigured = useCloudflareBackend;

async function workerRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!useCloudflareBackend) throw new Error("backend_not_configured");
  const token = sessionStorage.getItem(workerTokenKey);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`/api${path}`, { ...init, headers, credentials: "omit" });
  if (response.status === 401) sessionStorage.removeItem(workerTokenKey);
  const payload = await response.json().catch(() => ({ error: "invalid_response" }));
  if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "request_failed");
  return payload as T;
}

export async function listPublicProducts(): Promise<BackendProduct[]> {
  const result = await workerRequest<{ products: BackendProduct[] }>("/products");
  return result.products;
}

export async function adminSignIn(email: string, password: string): Promise<void> {
  const result = await workerRequest<{ token: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  sessionStorage.setItem(workerTokenKey, result.token);
}

export async function verifyAdminAccess(): Promise<boolean> {
  try {
    await workerRequest<{ valid: true }>("/admin/session");
    return true;
  } catch {
    return false;
  }
}

export async function adminSignOut(): Promise<void> {
  sessionStorage.removeItem(workerTokenKey);
}

export async function listAdminProducts(): Promise<BackendProduct[]> {
  const result = await workerRequest<{ products: BackendProduct[] }>("/admin/products");
  return result.products;
}

export async function saveAdminProduct(id: number | null, draft: BackendProductDraft): Promise<void> {
  await workerRequest(id === null ? "/admin/products" : `/admin/products/${id}`, {
    method: id === null ? "POST" : "PUT",
    body: JSON.stringify(draft),
  });
}

export async function updateAdminProduct(id: number, changes: Partial<BackendProductDraft>): Promise<void> {
  await workerRequest(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export async function deleteAdminProduct(id: number): Promise<void> {
  await workerRequest(`/admin/products/${id}`, { method: "DELETE" });
}
