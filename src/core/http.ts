import { BACKEND_BASE_URL } from "./config";

export async function http<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const token = localStorage.getItem("session_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include", // por si tu backend usa cookie/sesión
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${text}`);
  }
  return res.json() as Promise<T>;
}
