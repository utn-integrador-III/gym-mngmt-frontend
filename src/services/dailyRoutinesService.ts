// src/services/dailyRoutinesService.ts
import { BACKEND_BASE_URL } from "../core/config";

export type Routine = {
  _id: string;
  name: string;
  id_coach: string;
  id_exercise: string[];
};

const BASE = `${BACKEND_BASE_URL}/dailyroutines`;

/* Helpers */
const txt = async (r: Response) => `[HTTP ${r.status}] ${await r.text().catch(() => "")}`;
const idStr = (v: any): string =>
  typeof v === "string" ? v : v?.$oid ?? v?.$id ?? (v ? String(v) : "");

const normalize = (r: any): Routine => ({
  _id: idStr(r?._id),
  name: r?.name ?? "",
  id_coach: idStr(r?.id_coach),
  id_exercise: Array.isArray(r?.id_exercise) ? r.id_exercise.map(idStr) : [],
});

/* LISTAR */
export async function getDailyRoutines(): Promise<Routine[]> {
  const res = await fetch(`${BASE}/`, { credentials: "include" });
  if (!res.ok) throw new Error(await txt(res));
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalize) : [];
}

/* OBTENER POR ID (con fallback /{id} y /{id}/) */
export async function getDailyRoutine(id: string): Promise<Routine> {
  const idEnc = encodeURIComponent(id.trim());
  for (const url of [`${BASE}/${idEnc}`, `${BASE}/${idEnc}/`]) {
    const res = await fetch(url, { credentials: "include" });
    if (res.ok) return normalize(await res.json());
    if (res.status !== 404) throw new Error(await txt(res));
  }
  throw new Error("HTTP 404 Not Found");
}

/* CREAR */
export async function createDailyRoutine(data: {
  id_coach: string;
  id_exercise: string[];
  name: string;
}): Promise<Routine> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await txt(res));
  return normalize(await res.json());
}

/* ACTUALIZAR (fallback /{id} y /{id}/) */
export async function updateDailyRoutine(
  id: string,
  data: { id_coach: string; id_exercise: string[]; name: string }
): Promise<Routine> {
  const idEnc = encodeURIComponent(id.trim());
  for (const url of [`${BASE}/${idEnc}`, `${BASE}/${idEnc}/`]) {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) return normalize(await res.json());
    if (res.status !== 404) throw new Error(await txt(res));
  }
  throw new Error("HTTP 404 Not Found");
}

/* ELIMINAR (fallback /{id} y /{id}/) */
export async function deleteDailyRoutine(id: string): Promise<void> {
  const BASE = `${BACKEND_BASE_URL}/dailyroutines`;
  const idEnc = encodeURIComponent(id.trim());

  let lastMsg = "";
  for (const url of [`${BASE}/${idEnc}`, `${BASE}/${idEnc}/`]) {
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    console.log("[DELETE]", url, "→", res.status);
    if (res.ok || res.status === 204) return;

    const body = await res.text().catch(() => "");
    lastMsg = `${url} → [HTTP ${res.status}] ${body}`;
    // si probamos /{id} y da 404, intentamos /{id}/; si también 404, lanzamos
    if (res.status !== 404) break;
  }
  throw new Error(lastMsg || "DELETE failed");
}
