import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/trainers/clientList.css";

import { usersApi, type User } from "../../services/usersService";
import { getAssignedRoutines, AssignedRoutine } from "../../services/assignedRoutinesService";

export default function ClientList() {
  const navigate = useNavigate();

  // 🔁 Ajusta estas rutas si tu router usa otras
  const TRAINER_MENU_PATH = "/TrainerMenu";
  const PROGRESS_PATH = (id: string) => `/trainer/clients/${id}/progress`;
  // Si tu AssignRoutine acepta ?client=ID para preseleccionar:
  const ASSIGN_PATH = (id: string) => `/AssignRoutine?client=${id}`;

  const [clients, setClients] = useState<User[]>([]);
  const [assigned, setAssigned] = useState<AssignedRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [clts, asg] = await Promise.all([usersApi.list(), getAssignedRoutines()]);
        setClients(clts || []);
        setAssigned(asg || []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los clientes. Verifique su conexión.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Progreso por cliente
  const progressByClient = useMemo(() => {
    const map: Record<string, { total: number; done: number; percent: number }> = {};
    for (const r of assigned) {
      const id = r.id_client;
      if (!id) continue;
      if (!map[id]) map[id] = { total: 0, done: 0, percent: 0 };
      map[id].total += 1;
      if (r.done) map[id].done += 1;
    }
    for (const id of Object.keys(map)) {
      const { total, done } = map[id];
      map[id].percent = total ? Math.round((done / total) * 100) : 0;
    }
    return map;
  }, [assigned]);

  // Búsqueda por username o teléfono/email si existen
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter((c) =>
      (c.username?.toLowerCase().includes(s)) ||
      (c.phone?.toLowerCase?.().includes(s)) ||
      (c as any).email?.toLowerCase?.().includes(s)
    );
  }, [q, clients]);

  // Orden por progreso desc
  const ordered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const pa = progressByClient[a._id]?.percent ?? 0;
      const pb = progressByClient[b._id]?.percent ?? 0;
      return pb - pa;
    });
  }, [filtered, progressByClient]);

  const initials = (username?: string) =>
    (username ?? "??")
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "??";

  const handleProgress = (id: string) => navigate(PROGRESS_PATH(id));
  const handleAssign = (id: string) => navigate(ASSIGN_PATH(id));

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
            onChange={(e) => setQ(e.target.value)}
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
          {ordered.map((c) => {
            const prog = progressByClient[c._id]?.percent ?? 0;
            const total = progressByClient[c._id]?.total ?? 0;
            const done = progressByClient[c._id]?.done ?? 0;

            const hasPhoto = Boolean(c.photo); // el backend guarda el id de GridFS en `photo`
            const photoSrc = usersApi.photoUrl(c._id); // GET /users/{id}/photo

            return (
              <div className="card glass" key={c._id}>
                <div className="card-top">
                  {hasPhoto ? (
                    <img
                      src={photoSrc}
                      alt={c.username}
                      className="avatar"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="avatar fallback" aria-label="avatar">
                      {initials(c.username)}
                    </div>
                  )}

                  <div className="info">
                    <div className="name">{c.username}</div>
                    {("email" in c && (c as any).email) && (
                      <div className="sub em">{(c as any).email}</div>
                    )}
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
                  <button className="btn ghost" onClick={() => handleProgress(c._id)}>
                    Ver progreso
                  </button>
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
