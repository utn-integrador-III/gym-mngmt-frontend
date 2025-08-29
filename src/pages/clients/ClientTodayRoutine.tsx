import { useEffect, useMemo, useState } from "react";
import "../../styles/clients/todayRoutine.css";
import {
  getAssignedRoutines,
  updateAssignedRoutine,
  type AssignedRoutine,
} from "../../services/assignedRoutinesService";
import { getDailyRoutines, type Routine } from "../../services/dailyRoutinesService";

// ⚠️ cliente fijo para probar
const clientId = "68b1ebde499eca6a2d75bd7f";

// Días hábiles (las tabs)
const WDAYS = ["lunes", "martes", "miércoles", "jueves", "viernes"] as const;
type Weekday = typeof WDAYS[number];

// helpers
const toStr = (v: any) => (v == null ? "" : String(v));
const normalizeDay = (s: string) =>
  toStr(s)
    .normalize("NFD")
    // @ts-ignore unicode escapes
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const TODAY = (() => {
  const map = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  return normalizeDay(map[new Date().getDay()] || "lunes");
})();

export default function ClientTodayRoutine() {
  const [day, setDay] = useState<Weekday>(() =>
    WDAYS.includes(TODAY as Weekday) ? (TODAY as Weekday) : "lunes"
  );

  const [assignedRoutines, setAssignedRoutines] = useState<AssignedRoutine[]>([]);
  const [routinesMap, setRoutinesMap] = useState<Record<string, string>>({});
  const [selectedRoutine, setSelectedRoutine] = useState<AssignedRoutine | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyToggle, setBusyToggle] = useState(false);
  const [busyNote, setBusyNote] = useState(false);

  // Carga inicial
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [asgsRaw, routines] = await Promise.all([
          getAssignedRoutines(),
          getDailyRoutines(),
        ]);

        // mapa rutinaId -> nombre
        const map: Record<string, string> = {};
        (routines as Routine[]).forEach((r) => (map[toStr((r as any)._id)] = r.name));
        setRoutinesMap(map);

        // normaliza assigned y filtra por cliente
        const asgs = (asgsRaw as any[]).map((a) => ({
          ...a,
          _id: toStr(a._id ?? a.id),
          id_client: toStr(a.id_client ?? a.client_id),
          id_coach: toStr(a.id_coach ?? a.coach_id),
          id_dailyroutineexercise: toStr(
            a.id_dailyroutineexercise ?? a.daily_routine_id ?? a.routineId
          ),
          dayofweek: normalizeDay(a.dayofweek),
        }));
        const mine = asgs.filter((r) => r.id_client === clientId);
        setAssignedRoutines(mine);

        // si hoy no tiene rutina, salta al primer día con asignación
        const daysWithData = WDAYS.filter((d) =>
          mine.some((r) => normalizeDay(r.dayofweek) === normalizeDay(d))
        );
        if (daysWithData.length && !daysWithData.includes(day)) setDay(daysWithData[0]);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar las rutinas asignadas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // rutina seleccionada por día
  useEffect(() => {
    const match =
      assignedRoutines.find((r) => normalizeDay(r.dayofweek) === normalizeDay(day)) || null;
    setSelectedRoutine(match);
    setNoteInput(match?.notes ?? "");
  }, [day, assignedRoutines]);

  // Construye payload COMPLETO para PUT (sin tocar backend)
  const buildFullUpdate = (
    base: AssignedRoutine,
    patch: Partial<AssignedRoutine>
  ): Omit<AssignedRoutine, "_id"> => ({
    id_coach: base.id_coach,
    id_client: base.id_client,
    id_dailyroutineexercise: base.id_dailyroutineexercise,
    dayofweek: base.dayofweek,
    notes: patch.notes ?? base.notes ?? "",
    done: patch.done ?? base.done ?? false,
  });

  const handleToggleDone = async () => {
    if (!selectedRoutine || busyToggle) return;
    if (!selectedRoutine._id) return alert("Rutina inválida.");
    setBusyToggle(true);
    try {
      const payload = buildFullUpdate(selectedRoutine, { done: !selectedRoutine.done });
      const updated = await updateAssignedRoutine(selectedRoutine._id, payload as any);
      setAssignedRoutines((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el estado. Intenta de nuevo.");
    } finally {
      setBusyToggle(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedRoutine || busyNote) return;
    const trimmed = noteInput.trim();
    if (!trimmed) return alert("La nota no puede estar vacía.");
    if (trimmed.length > 500) return alert("Máximo 500 caracteres.");
    setBusyNote(true);
    try {
      const payload = buildFullUpdate(selectedRoutine, { notes: trimmed });
      const updated = await updateAssignedRoutine(selectedRoutine._id, payload as any);
      setAssignedRoutines((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar la nota.");
    } finally {
      setBusyNote(false);
    }
  };

  const progress = useMemo(() => {
    const total = assignedRoutines.length || 1;
    const done = assignedRoutines.filter((r) => r.done).length;
    return Math.round((done / total) * 100);
  }, [assignedRoutines]);

  return (
    <div className="routine-container">
      <h2 className="routine-brand">GYM KSG</h2>

      <div className="day-tabs" role="tablist" aria-label="Días de la semana">
        {WDAYS.map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={d === day}
            className={`day-tab ${d === day ? "active-day" : ""}`}
            onClick={() => setDay(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : (
        <>
          <div className="cards-grid">
            <div className="routine-box glass">
              <h3>My routine today</h3>
              <p className="routine-name">
                {selectedRoutine
                  ? routinesMap[selectedRoutine.id_dailyroutineexercise] ?? "Nombre no disponible"
                  : "No routine assigned"}
              </p>

              <div className="toggle-box">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!!selectedRoutine?.done}
                    onChange={handleToggleDone}
                    disabled={!selectedRoutine || busyToggle}
                    aria-label="Mark as done"
                  />
                  <span className="slider" />
                </label>
                <span className="toggle-label">
                  {selectedRoutine?.done ? "Done" : "Pending"}
                </span>
              </div>
            </div>

            <div className="progress-box glass">
              <h3>My progress</h3>
              <div className="progress-bar" aria-label="Progress bar">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-text">{progress}%</p>
            </div>
          </div>

          {selectedRoutine && (
            <div className="notes-box glass">
              <div className="notes-header">
                <h4>Notes</h4>
                <small className="muted">{noteInput.length}/500</small>
              </div>

              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value.slice(0, 500))}
                rows={5}
                placeholder="Write something about today’s routine…"
              />

              <div className="notes-actions">
                <button
                  onClick={handleSaveNote}
                  disabled={busyNote || noteInput.trim() === (selectedRoutine.notes ?? "")}
                >
                  {busyNote ? "Saving…" : "Save Note"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
