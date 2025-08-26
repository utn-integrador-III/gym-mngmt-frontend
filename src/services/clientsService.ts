// Servicio de clientes (listar clientes para el listado con foto y progreso)
import { BACKEND_BASE_URL } from "../core/config";

export type Client = {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  role?: string;
  photo_url?: string; // URL absoluta o relativa servida por tu backend
  photo?: string;     // por si tu backend usa otro nombre
};

// Normaliza por si el backend devuelve {items:[]} o {results:[]}
function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

/**
 * Obtiene la lista de clientes.
 * ⚠️ Ajusta la URL según tu backend:
 *   - Opción A (filtro por rol):   /users/?role=Client
 *   - Opción B (endpoint dedicado):/users/clients
 *   - Opción C (todos y filtras):  /users/
 */
export async function getClients(): Promise<Client[]> {
  const API = BACKEND_BASE_URL;

  // Intenta con ?role=Client, si falla, prueba /users/clients, y por último /users/
  const candidates = [
    `${API}/users/?role=Client`,
    `${API}/users/clients`,
    `${API}/users/`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) continue;
      const json = await res.json();
      const arr = toArray(json);

      // Si vino todo el mundo, filtramos solo clientes
      const clients = arr.filter(
        (u: any) =>
          !u.role || String(u.role).toLowerCase() === "client".toLowerCase()
      );

      // Asegura forma mínima esperada
      return clients.map((u: any) => ({
        _id: u._id ?? u.id,
        name: u.name ?? u.fullName ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
        username: u.username,
        email: u.email,
        role: u.role,
        photo_url: u.photo_url ?? u.avatarUrl ?? u.photo ?? u.avatar, // intenta varios nombres comunes
        photo: u.photo, // por compatibilidad
      }));
    } catch {
      // intenta el siguiente candidato
    }
  }

  throw new Error("No se pudo obtener la lista de clientes");
}
