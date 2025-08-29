// src/services/usersService.ts
import { BACKEND_BASE_URL } from "../core/config";

export type User = {
  _id: string;
  username: string;
  gender: "male" | "female";
  phone?: string;
  photo?: string; // id de GridFS (si existe)
};

export const usersApi = {
  photoUrl(userId: string) {
    // GET /users/{user_id}/photo
    return `${BACKEND_BASE_URL}/users/${userId}/photo`;
  },

  // Listar usuarios
  async list(): Promise<User[]> {
    const res = await fetch(`${BACKEND_BASE_URL}/users/`, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // Obtener usuario por ID
  async get(userId: string): Promise<User> {
    const res = await fetch(`${BACKEND_BASE_URL}/users/${userId}`, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // 👉 Crear usuario (multipart/form-data)
  async create(fd: FormData): Promise<User> {
    const res = await fetch(`${BACKEND_BASE_URL}/users/`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text().catch(() => "")}`);
    return res.json();
  },

  // 👉 Actualizar cualquier campo y/o foto (multipart/form-data)
  async update(userId: string, fd: FormData): Promise<User> {
    const res = await fetch(`${BACKEND_BASE_URL}/users/${userId}`, {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text().catch(() => "")}`);
    return res.json();
  },

  //eliminar usuario
  async remove(userId: string): Promise<{ ok: boolean }> {
    const res = await fetch(`${BACKEND_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true };
  },
};
