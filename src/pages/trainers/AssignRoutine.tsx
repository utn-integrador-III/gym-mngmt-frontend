import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/trainers/assignRoutine.css";

import { getDailyRoutines, type Routine } from "../../services/dailyRoutinesService";
import { createAssignedRoutine } from "../../services/assignedRoutinesService";
import { usersApi } from "../../services/usersService";

type Client = {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  photo?: string;
  photo_url?: string;
};

type Row = { routineId: string; day?: string };

// Helpers
const isObjectId = (s: string) => /^[a-f0-9]{24}$/i.test(s);

// Coach quemado
const FIXED_COACH_ID = "68b22994453029b815a86184";

export default function AssignRoutine() {
  const navigate = useNavigate();
  const TRAINER_MENU_PATH = "../trainerMenu";

  const [clients, setClients] = useState<Client[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [rows, setRows] = useState<Row[]>([{ routineId: "" }]);
  const [clientId, setClientId] = useState<string>("");

  const [asignarSemana, setAsignarSemana] = useState(true); // L–V por defecto
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const days = useMemo(
    () => ["lunes", "martes", "miércoles", "jueves", "viernes"],
    []
  );

  // Cargar usuarios y rutinas 
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [users, dailies] = await Promise.all([usersApi.list(), getDailyRoutines()]);
        const normalized: Client[] = (Array.isArray(users) ? users : []).map((u: any) => ({
          _id: String(u?._id ?? u?.id ?? ""),
          name: u?.name ?? u?.fullname ?? "",     
          username: u?.username ?? "",
          email: u?.email ?? "",
          role: u?.role,                           
          photo: u?.photo,
          photo_url: u?.photo_url,
        }));

        const onlyClients = normalized.filter((c) => {
          if (!c.role) return true;
          const r = c.role.toLowerCase();
          return ["cliente", "client", "usuario", "user"].includes(r);
        });

        setClients(onlyClients);
        setRoutines(Array.isArray(dailies) ? dailies : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los clientes o las rutinas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addRow = () => setRows((r) => [...r, { routineId: "" }]);
  const removeRow = (idx: number) =>
    setRows((r) => (r.length === 1 ? r : r.filter((_, i) => i !== idx)));
  const changeRow = (idx: number, patch: Partial<Row>) =>
    setRows((r) => {
      const copy = [...r];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });

  // Validaciones dinámicas
  const allFilled = useMemo(() => {
    if (!clientId || rows.length === 0) return false;
    if (asignarSemana) return rows.every((x) => x.routineId);
    return rows.every((x) => x.routineId && x.day);
  }, [clientId, rows, asignarSemana]);

  const hasRowDuplicates = useMemo(() => {
    if (asignarSemana) return false;
    const keys = rows
      .filter((x) => x.day && x.routineId)
      .map((x) => `${x.day}::${x.routineId}`);
    return new Set(keys).size !== keys.length;
  }, [rows, asignarSemana]);

  const canSubmit = allFilled && !hasRowDuplicates && !saving && !loading;

  const routineName = (id: string) =>
    routines.find((r) => r._id === id)?.name || "Rutina";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!clientId) {
      setError("Debes seleccionar un cliente.");
      return;
    }
    if (!isObjectId(FIXED_COACH_ID)) {
      setError("ID de coach quemado inválido (debe ser ObjectId de 24 hex).");
      return;
    }

    
    let selected = clients.find((c) => c._id === clientId);
    let roleLower = selected?.role?.toLowerCase?.() || "";
    if (!roleLower) {
      try {
        const detail: any = await usersApi.get(clientId);
        roleLower = detail?.role?.toLowerCase?.() || "";
        
        if (selected) selected.role = detail?.role;
      } catch {
        // si no se puede leer el detalle, no bloquees; asumimos cliente y validará backend si aplica
      }
    }
    if (roleLower && !["cliente", "client", "usuario", "user"].includes(roleLower)) {
      setError("Solo se puede asignar rutinas a usuarios con rol de Cliente.");
      return;
    }

    if (asignarSemana) {
      if (!rows.every((r) => r.routineId)) {
        setError("Debes seleccionar al menos una rutina.");
        return;
      }
    } else {
      if (!rows.every((r) => r.routineId && r.day)) {
        setError("Todas las filas deben tener una rutina y un día asignados.");
        return;
      }
      if (hasRowDuplicates) {
        setError("No puedes asignar la misma rutina más de una vez en el mismo día.");
        return;
      }
    }
    let pairs: { routineId: string; day: string }[] = [];
    if (asignarSemana) {
      for (const r of rows) {
        for (const d of days) pairs.push({ routineId: r.routineId, day: d });
      }
    } else {
      pairs = rows.map((r) => ({ routineId: r.routineId!, day: r.day! }));
    }

    // Deduplicar
    const seen = new Set<string>();
    const uniquePairs = pairs.filter((p) => {
      const k = `${p.day}::${p.routineId}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    setSaving(true);
    try {
      await Promise.all(
        uniquePairs.map((p) =>
          createAssignedRoutine({
            id_client: clientId,
            id_coach: FIXED_COACH_ID,
            id_dailyroutineexercise: p.routineId,
            dayofweek: p.day,
            notes: "",
            done: false,
          })
        )
      );
      setSuccessMsg(
        asignarSemana
          ? "¡Rutinas asignadas de lunes a viernes!"
          : "¡Rutina(s) asignada(s) con éxito!"
      );
      setRows([{ routineId: "" }]);
    } catch (err) {
      console.error(err);
      setError("Error al asignar rutina(s). Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="assign-container">
      <button
        type="button"
        className="btn back"
        onClick={() => navigate(TRAINER_MENU_PATH)}
      >
        ← Volver al menú
      </button>

      <h2 className="assign-title">Asignar Rutina(s)</h2>

      <form className="assign-card" onSubmit={handleSubmit}>
        {/* Cliente */}
        <div className="form-row">
          <label className="lbl">Cliente</label>
          <select
            className={`in sel ${!clientId ? "is-placeholder" : ""}`}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Seleccionar cliente…
            </option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {(c.name || c.username || c.email || "Sin nombre")}
                {c.username ? ` (@${c.username})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle semana completa */}
        <div className="form-row" style={{ justifyContent: "space-between" }}>
          <label className="lbl">Asignar a toda la semana (L–V)</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={asignarSemana}
              onChange={(e) => setAsignarSemana(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        {/* Filas */}
        <div className="rows-head">
          <span>{asignarSemana ? "Rutinas (se asignarán a L–V)" : "Asignaciones"}</span>
          <div className="rows-actions">
            <button type="button" className="btn ghost" onClick={addRow}>
              + Agregar fila
            </button>
          </div>
        </div>

        {loading ? (
          <div className="skeleton" />
        ) : (
          rows.map((row, idx) => (
            <div className="row" key={idx}>
              <div className="row-num">#{idx + 1}</div>

              <select
                className={`in sel ${!row.routineId ? "is-placeholder" : ""}`}
                value={row.routineId}
                onChange={(e) => changeRow(idx, { routineId: e.target.value })}
                required
              >
                <option value="" disabled hidden>
                  Seleccionar rutina…
                </option>
                {routines.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {!asignarSemana && (
                <select
                  className={`in sel ${!row.day ? "is-placeholder" : ""}`}
                  value={row.day || ""}
                  onChange={(e) => changeRow(idx, { day: e.target.value })}
                  required={!asignarSemana}
                >
                  <option value="" disabled hidden>
                    Día…
                  </option>
                  {days.map((d) => (
                    <option value={d} key={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                className="btn danger"
                onClick={() => removeRow(idx)}
                disabled={rows.length === 1}
                title={rows.length === 1 ? "Debe existir al menos una fila" : "Eliminar fila"}
              >
                Eliminar
              </button>
            </div>
          ))
        )}

        {/* Mensajes */}
        {!asignarSemana && hasRowDuplicates && (
          <div className="msg warn">
            Tienes filas duplicadas (misma rutina y día). Ajusta antes de guardar.
          </div>
        )}
        {error && (
          <div className="msg error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="msg ok" role="status" aria-live="polite">
            {successMsg}
          </div>
        )}

        {/* Preview */}
        {allFilled && (
          <div className="preview">
            <h4>
              Se asignará a {clients.find((c) => c._id === clientId)?.name || clients.find((c) => c._id === clientId)?.username || "Cliente"}:
            </h4>
            <ul>
              {asignarSemana
                ? rows.map((r, i) => (
                    <li key={i}>
                      {routineName(r.routineId)} — Lunes a Viernes
                    </li>
                  ))
                : rows.map((r, i) => (
                    <li key={i}>
                      {routineName(r.routineId)} — {r.day}
                    </li>
                  ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <button type="submit" className="btn primary" disabled={!canSubmit}>
            {saving ? "Guardando…" : "Guardar Asignaciones"}
          </button>
        </div>
      </form>
    </div>
  );
}
