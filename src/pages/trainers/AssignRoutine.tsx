import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/trainers/assignRoutine.css";

import { getDailyRoutines, Routine } from "../../services/dailyRoutinesService";
import { createAssignedRoutine } from "../../services/assignedRoutinesService";
import { getClients } from "../../services/clientsService";

const coachId = localStorage.getItem("coach_id") || ""; // ⚠️ Coach debe estar en sesión

type Client = {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  photo_url?: string;
  photo?: string;
};

type Row = { routineId: string; day: string };

export default function AssignRoutine() {
  const navigate = useNavigate();
  const TRAINER_MENU_PATH = "../trainerMenu";

  const [clients, setClients] = useState<Client[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [rows, setRows] = useState<Row[]>([{ routineId: "", day: "" }]);
  const [clientId, setClientId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const days = useMemo(
    () => ["lunes", "martes", "miércoles", "jueves", "viernes"],
    []
  );

  // Verificar sesión
  useEffect(() => {
    if (!coachId) {
      alert("Sesión inválida. Vuelve a iniciar sesión.");
      navigate("/login");
    }
  }, [navigate]);

  // Cargar clientes y rutinas
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [clts, dailies] = await Promise.all([getClients(), getDailyRoutines()]);
        setClients(clts || []);
        setRoutines(dailies || []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los clientes o las rutinas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addRow = () => setRows((r) => [...r, { routineId: "", day: "" }]);
  const removeRow = (idx: number) =>
    setRows((r) => (r.length === 1 ? r : r.filter((_, i) => i !== idx)));
  const changeRow = (idx: number, patch: Partial<Row>) =>
    setRows((r) => {
      const copy = [...r];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });

  // Validaciones dinámicas
  const allFilled =
    clientId &&
    rows.every((x) => x.routineId && x.day) &&
    rows.length > 0;

  const hasRowDuplicates = useMemo(() => {
    const keys = rows
      .filter((x) => x.day && x.routineId)
      .map((x) => `${x.day}::${x.routineId}`);
    return new Set(keys).size !== keys.length;
  }, [rows]);

  const canSubmit = allFilled && !hasRowDuplicates && !saving && !loading;

  const routineName = (id: string) =>
    routines.find((r) => r._id === id)?.name || "Rutina";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // 🔹 Validación de cliente
    if (!clientId) {
      setError("Debes seleccionar un cliente.");
      return;
    }

    // 🔹 Validación de filas completas
    if (!rows.every((r) => r.routineId && r.day)) {
      setError("Todas las filas deben tener una rutina y un día asignados.");
      return;
    }

    // 🔹 Validación de duplicados
    if (hasRowDuplicates) {
      setError("No puedes asignar la misma rutina más de una vez en el mismo día.");
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        rows.map((r) =>
          createAssignedRoutine({
            id_client: clientId,
            id_coach: coachId,
            id_dailyroutineexercise: r.routineId,
            dayofweek: r.day,
            notes: "",
            done: false,
          })
        )
      );
      setSuccessMsg("¡Rutina(s) asignada(s) con éxito!");
      setRows([{ routineId: "", day: "" }]);
    } catch (e) {
      console.error(e);
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
                {c.name} {c.username ? `(@${c.username})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Filas */}
        <div className="rows-head">
          <span>Asignaciones</span>
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

              <select
                className={`in sel ${!row.day ? "is-placeholder" : ""}`}
                value={row.day}
                onChange={(e) => changeRow(idx, { day: e.target.value })}
                required
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

              <button
                type="button"
                className="btn danger"
                onClick={() => removeRow(idx)}
                disabled={rows.length === 1}
                title={
                  rows.length === 1
                    ? "Debe existir al menos una fila"
                    : "Eliminar fila"
                }
              >
                Eliminar
              </button>
            </div>
          ))
        )}

        {/* Mensajes */}
        {hasRowDuplicates && (
          <div className="msg warn">
            Tienes filas duplicadas (misma rutina y día). Ajusta antes de guardar.
          </div>
        )}
        {error && <div className="msg error">{error}</div>}
        {successMsg && <div className="msg ok">{successMsg}</div>}

        {/* Preview */}
        {allFilled && (
          <div className="preview">
            <h4>Se asignará a {clients.find((c) => c._id === clientId)?.name}:</h4>
            <ul>
              {rows.map((r, i) => (
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
