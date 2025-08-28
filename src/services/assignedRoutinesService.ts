// src/services/assignedRoutinesService.ts
import { BACKEND_BASE_URL } from "../core/config";

export interface AssignedRoutine {
  _id: string;
  id_dailyroutineexercise: string;
  id_client: string;
  id_coach: string;
  notes: string;
  done: boolean;
  dayofweek: string;
}

export type AssignedRoutinePatch = Partial<Pick<AssignedRoutine, "notes" | "done">>;

const BASE = `${BACKEND_BASE_URL}/assignedroutines`; // <-- sin guion bajo

export async function getAssignedRoutines(): Promise<AssignedRoutine[]> {
  const res = await fetch(`${BASE}/`, { credentials: "include" });
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}

export async function updateAssignedRoutine(id: string, patch: AssignedRoutinePatch) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT", // <-- tu backend define PUT
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}

// Tipo para crear (permite done opcional)
export type NewAssignedRoutine = {
  id_client: string;
  id_coach: string;
  id_dailyroutineexercise: string;
  dayofweek: string;
  notes?: string;
  done?: boolean; // <-- para poder enviar done: false
};

export async function createAssignedRoutine(data: NewAssignedRoutine) {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[HTTP ${res.status}] ${await res.text()}`);
  return res.json();
}
