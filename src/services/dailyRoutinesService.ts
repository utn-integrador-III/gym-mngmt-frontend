import { BACKEND_BASE_URL } from "../core/config";

export interface Routine {
  _id: string;
  name: string;
}

export async function getDailyRoutines(): Promise<Routine[]> {
  const res = await fetch(`${BACKEND_BASE_URL}/daily_routines`);
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}

/** Ajusta este endpoint/shape según tu FastAPI */
export async function createDailyRoutine(data: { name: string; id_exercise: string }) {
  const res = await fetch(`${BACKEND_BASE_URL}/daily_routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}
