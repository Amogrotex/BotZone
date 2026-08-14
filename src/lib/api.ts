// Central API client. Authentication is verified by the backend with a JWT.
// In development Vite proxies /api to the backend; production should set VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("botzone_token");
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("اتصال به سرور برقرار نشد. دوباره تلاش کنید.", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token && path !== "/auth/login") {
      window.dispatchEvent(new Event("botzone:unauthorized"));
    }
    throw new ApiError(data.error || "خطایی در ارتباط با سرور رخ داد", res.status);
  }
  return data;
}

export const authApi = {
  login: (email: string, password: string) => apiFetch("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  }),
  signup: (data: { name: string; email: string; password: string }) => apiFetch("/auth/signup", {
    method: "POST", body: JSON.stringify(data),
  }),
  google: (accessToken: string) => apiFetch("/auth/google", {
    method: "POST", body: JSON.stringify({ accessToken }),
  }),
  me: () => apiFetch("/auth/me"),
  updateProfile: (data: { name: string; avatar?: string }) => apiFetch("/auth/me", {
    method: "PATCH", body: JSON.stringify(data),
  }),
  updatePassword: (data: { currentPassword?: string; newPassword: string }) => apiFetch("/auth/password", {
    method: "PATCH", body: JSON.stringify(data),
  }),
};

export const botsApi = {
  list: () => apiFetch("/bots"),
  create: (data: unknown) => apiFetch("/bots", { method: "POST", body: JSON.stringify(data) }),
  uploadFile: (botId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch(`/bots/${botId}/files`, { method: "POST", body: form });
  },
};
