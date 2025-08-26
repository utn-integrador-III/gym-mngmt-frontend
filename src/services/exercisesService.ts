import { BACKEND_BASE_URL } from "../core/config";

export type Exercise = {
  _id: string;
  name: string;
  description?: string;
};

// Base sin slash final; lo agregamos al llamar
const BASE = `${BACKEND_BASE_URL}/exercises`;

export async function createExercise(data: { name: string; description?: string }): Promise<Exercise> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // quítalo si no usas cookies/session
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}

export async function getExercises(): Promise<Exercise[]> {
  const res = await fetch(`${BASE}/`, { credentials: "include" });
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}

export async function deleteExercise(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include", // quítalo si no usas cookies/sesión
  });

  // Tu API puede responder 200/202/204
  if (res.status === 204) return;
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`[HTTP ${res.status}] ${txt || "No se pudo eliminar el ejercicio"}`);
  }
}