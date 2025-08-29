import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/trainers/clientList.css";

import { usersApi, type User } from "../../services/usersService";
import { getAssignedRoutines, type AssignedRoutine } from "../../services/assignedRoutinesService";

export default function ClientList() {
  const navigate = useNavigate();

  const TRAINER_MENU_PATH = "/TrainerMenu";
  const PROGRESS_PATH = (id: string) => `/trainer/clients/${id}/progress`;
  const ASSIGN_PATH = (id: string) => `/AssignRoutine?client=${id}`;

  // Para mayor tolerancia, usamos User | any
  const [clients, setClients] = useState<(User & { _id: string })[]>([]);
  const [assigned, setAssigned] = useState<AssignedRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // ---------- Helpers de normalización ----------
  const ensureArray = (x: any): any[] => {
    if (Array.isArray(x)) return x;
    if (Array.isArray(x?.data)) return x.data;
    if (Array.isArray(x?.results)) return x.results;
    if (Array.isArray(x?.items)) return x.items;
    return [];
  };

  const asStringId = (u: any): string => {
    if (typeof u?._id === "string") return u._id;
    if (typeof u?.id === "string") return u.id;
    if (typeof u?.id === "number") return String(u.id);
    // Mongo puede venir como { _id: { $oid: "..." } }
    const oid = u?._id?.$oid || u?.id?.$oid;
    return typeof oid === "string" ? oid : "";
  };

  const isClientRole = (role: any) => {
    const r = String(role || "").toLowerCase();
    return r === "client" || r === "cliente" || r === "user" || r === "cliente_app"; // ajusta si usas otro
  };

  const deriveEmail = (u: any) =>
    u?.email || u?.mail || u?.contact?.email || "";

  const deriveUsername = (u: any) =>
    u?.username || u?.name || u?.fullName || "";

  const derivePhone = (u: any) =>
    typeof u?.phone === "string"
      ? u.phone
      : u?.phone?.toString?.() || u?.contact?.phone || "";

  const derivePhoto = (u: any) =>
    u?.photo || u?.photo_url || u?.avatarUrl || u?.avatar || "";

  const asBool = (v: any) => !!v;

  // 🔹 Validar entrada del buscador
  const handleSearch = (value: string) => {
    if (value.length > 50) return; // prevenir cadenas extremadamente largas
    setQ(value);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Puedes intentar server-side filtering si tu service lo soporta:
        // const cltsRaw = await usersApi.list({ role: "Client" } as any);
        const cltsRaw = await usersApi.list();
        const asgRaw = await getAssignedRoutines();

        const cltsArr = ensureArray(cltsRaw);
        const asgArr = ensureArray(asgRaw);

        // Normaliza usuarios -> solo clientes
        const normalizedClients = cltsArr
          .map((u) => {
            const _id = asStringId(u);
            if (!_id) return null;
            return {
              ...u,
              _id,
              // Asegura campos usados por la UI:
              email: deriveEmail(u),
              username: deriveUsername(u),
              phone: derivePhone(u),
              photo: derivePhoto(u),
              role: u?.role,
            };
          })
          .filter(Boolean) as (User & { _id: string })[];

        // FILTRO rol de "cliente"
        const onlyClients =
          normalizedClients.filter((c) => isClientRole((c as any).role)) ||
          [];

        // Si no hay rol en tus usuarios omitir el filtro:
        const finalClients =
          onlyClients.length > 0 ? onlyClients : normalizedClients;

        // Normaliza asignaciones
        const normalizedAssigned = asgArr
          .map((a) => {
            const idClient: string =
              typeof a?.id_client === "string"
                ? a.id_client
                : asStringId(a?.id_client);
            if (!idClient) return null;
            return {
              ...a,
              id_client: idClient,
              done: asBool(a?.done),
            };
          })
          .filter(Boolean) as AssignedRoutine[];

        setClients(finalClients);
        setAssigned(normalizedAssigned);
      } catch (e: any) {
        console.error("Error cargando datos:", e);
        const msg =
          typeof e?.message === "string"
            ? e.message
            : "No se pudieron cargar los clientes. Verifique su conexión.";
        // Mapea errores típicos del http genérico
        if (/\[401\]/.test(msg)) {
          setError("No autorizado (401). Inicia sesión e inténtalo de nuevo.");
        } else if (/\[404\]/.test(msg)) {
          setError("Recurso no encontrado (404). Revisa la ruta del servicio.");
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Calcular progreso por cliente
  const progressByClient = useMemo(() => {
    const map: Record<
      string,
      { total: number; done: number; percent: number }
    > = {};
    for (const r of assigned) {
      const id = r?.id_client;
      if (!id) continue;
      if (!map[id]) map[id] = { total: 0, done: 0, percent: 0 };
      map[id].total += 1;
      if (r.done) map[id].done += 1;
    }
    Object.keys(map).forEach((id) => {
      const { total, done } = map[id];
      map[id].percent = total > 0 ? Math.round((done / total) * 100) : 0;
    });
    return map;
  }, [assigned]);

  // 🔹 Filtrar clientes según búsqueda
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter((c: any) => {
      const username = String(c?.username || "").toLowerCase();
      const phone = String(c?.phone || "").toLowerCase();
      const email = String(c?.email || "").toLowerCase();
      return username.includes(s) || phone.includes(s) || email.includes(s);
    });
  }, [q, clients]);

  // 🔹 Ordenar clientes según porcentaje de progreso
  const ordered = useMemo(() => {
    return [...filtered].sort((a: any, b: any) => {
      const pa = progressByClient[a._id]?.percent ?? 0;
      const pb = progressByClient[b._id]?.percent ?? 0;
      return pb - pa;
    });
  }, [filtered, progressByClient]);

  // 🔹 Función para iniciales del avatar
  const initials = (username?: string) =>
    (username ?? "??")
      .toString()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => (p[0]?.toUpperCase() ?? ""))
      .join("") || "??";

  // 🔹 Navegación segura
  

  const handleAssign = (id: string) => {
    if (!id) {
      alert("ID inválido para asignar rutina.");
      return;
    }
    navigate(ASSIGN_PATH(id));
  };

  return (
    <div className="clist-container">
      <div className="clist-header">
        <button className="btn back" onClick={() => navigate(TRAINER_MENU_PATH)}>
          ← Volver al menú
        </button>

        <h2 className="clist-title">Clientes</h2>

        <div className="clist-search">
          <input
            className="in search"
            placeholder="Buscar por usuario, teléfono o email…"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="msg error">{error}</div>}

      {loading ? (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="card skeleton" key={i} />
          ))}
        </div>
      ) : ordered.length === 0 ? (
        <div className="msg warn">No hay clientes que coincidan con la búsqueda.</div>
      ) : (
        <div className="grid">
          {ordered.map((c: any) => {
            const prog = progressByClient[c._id]?.percent ?? 0;
            const total = progressByClient[c._id]?.total ?? 0;
            const done = progressByClient[c._id]?.done ?? 0;

            const hasPhoto = !!derivePhoto(c);
            // Usa tu helper si existe, si no, cae al campo photo
            const photoSrc =
              typeof usersApi.photoUrl === "function" ? usersApi.photoUrl(c._id) : derivePhoto(c);

            return (
              <div className="card glass" key={c._id}>
                <div className="card-top">
                  {hasPhoto ? (
                    <img
                      src={photoSrc}
                      alt={c.username || "Cliente"}
                      className="avatar"
                      onError={(e) => {
                        // Esconde la imagen rota para mostrar fallback
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="avatar fallback" aria-label="avatar">
                      {initials(c.username)}
                    </div>
                  )}

                  <div className="info">
                    <div className="name">{c.username || "Sin nombre"}</div>
                    {c.email && <div className="sub em">{c.email}</div>}
                    {c.phone && <div className="sub">{c.phone}</div>}
                  </div>
                </div>

                <div className="prog">
                  <div className="prog-label">
                    <span>Progreso</span>
                    <span className="prog-num">{prog}%</span>
                  </div>
                  <div className="prog-bar">
                    <div className="fill" style={{ width: `${prog}%` }} />
                  </div>
                  <div className="prog-mini">
                    {done}/{total} rutinas completadas
                  </div>
                </div>

                <div className="actions">
                 
                  <button className="btn primary" onClick={() => handleAssign(c._id)}>
                    Asignar rutina
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
