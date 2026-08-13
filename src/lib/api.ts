// Central API client - frontend calls backend, not repo files directly
// This way, even if someone clones repo, they can't access data without backend URL + token

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("botzone_token");
  
  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API error");
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  signup: (data: any) => apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  google: (profile: any) => apiFetch("/auth/google", { method: "POST", body: JSON.stringify(profile) }),
  me: () => apiFetch("/auth/me"),
};

// Bots - these files are stored in server/storage/encrypted (gitignored)
export const botsApi = {
  list: () => apiFetch("/bots"),
  create: (data: any) => apiFetch("/bots", { method: "POST", body: JSON.stringify(data) }),
  uploadFile: async (botId: string, file: File) => {
    const token = localStorage.getItem("botzone_token");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/bots/${botId}/files`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
};
