import { useEffect, useMemo, useState } from "react";
import "../../styles/trainers/createRoutine.css";
import { getExercises, Exercise } from "../../services/exercisesService";
import { createDailyRoutine } from "../../services/dailyRoutinesService";
import { useNavigate } from "react-router-dom";
// Backend acepta: { id_coach: string, id_exercise: string[], name: string }

const MAX_EXERCISES = 8;
const coachId = "687e06685d26f6a1fe30c0a5"; // TODO: tomar de auth cuando lo tengas                    // 👈 nuevo
const TRAINER_MENU_PATH = "/TrainerMenu"; 

export default function CreateRoutine() {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [name, setName] = useState("Nueva rutina");
  const [rows, setRows] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  // Cargar ejercicios
  useEffect(() => {
    (async () => {
      try {
        const data = await getExercises();
        setExerciseList(data || []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los ejercicios.");
      }
    })();
  }, []);

  // Opciones para el select
  const options = useMemo(
    () => exerciseList.map(e => ({ id: e._id, label: e.name })),
    [exerciseList]
  );

  // Validaciones
  const allSelected = rows.length > 0 && rows.every(id => !!id);
  const clean = rows.filter(Boolean);
  const hasDuplicates = new Set(clean).size !== clean.length;
  const canAddRow = rows.length < MAX_EXERCISES;
  const canSubmit = !!name.trim() && allSelected && !hasDuplicates && !saving && rows.length >= 1;

  // Handlers
  const addRow = () => setRows(r => (r.length < MAX_EXERCISES ? [...r, ""] : r));
  const removeRow = (idx: number) =>
    setRows(r => (r.length === 1 ? r : r.filter((_, i) => i !== idx)));
  const changeRow = (idx: number, value: string) =>
    setRows(r => {
      const cp = [...r];
      cp[idx] = value;
      return cp;
    });
  const move = (from: number, to: number) =>
    setRows(r => {
      if (to < 0 || to >= r.length) return r;
      const cp = [...r];
      const [item] = cp.splice(from, 1);
      cp.splice(to, 0, item);
      return cp;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!canSubmit) {
      if (!name.trim()) setError("La rutina necesita un nombre.");
      else if (!allSelected) setError("Completa todas las filas.");
      else if (hasDuplicates) setError("No se permiten ejercicios duplicados.");
      return;
    }

    try {
      setSaving(true);
      // ✅ Payload alineado al backend
      await createDailyRoutine({
        id_coach: coachId,
        id_exercise: rows,      // array 1..8 en orden
        name: name.trim(),
      });
      setSuccess("¡Rutina creada con éxito!");
      setRows([""]);
      setName("Nueva rutina");
    } catch (e) {
      console.error(e);
      setError("Error creando la rutina.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cr-container">
      <div className="cr-toolbar">
        <button
          type="button"
          className="btn back"
          onClick={() => navigate(TRAINER_MENU_PATH)}
          title="Volver al menú del entrenador"
        >
          ← Volver al menú
        </button>
      </div>

      <h2 className="cr-title">Crear Rutina</h2>

      <form className="cr-card" onSubmit={handleSubmit}>
        {/* Nombre de la rutina */}
        <div className="form-row">
          <label className="lbl" htmlFor="rname">Nombre</label>
          <input
            id="rname"
            className="in"
            type="text"
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Rutina full body"
            required
          />
          <small className="muted">{name.length}/60</small>
        </div>

        {/* Encabezado */}
        <div className="rows-head">
          <div className="rows-title">
            <strong>Ejercicios</strong>
            <span className="muted">hasta {MAX_EXERCISES}</span>
          </div>
          <div className="rows-actions">
            <button type="button" className="btn ghost" onClick={addRow} disabled={!canAddRow}>
              + Agregar ejercicio
            </button>
          </div>
        </div>

        {/* Filas */}
        <div className="rows">
          {rows.map((val, idx) => (
            <div className="row" key={idx}>
              <div className="pill">#{idx + 1}</div>

              <select
                className={`in sel ${!val ? "is-placeholder" : ""}`}
                value={val}
                onChange={(e) => changeRow(idx, e.target.value)}
                required
              >
                <option value="" disabled hidden>Seleccionar…</option>
                {options.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              <div className="row-actions">
                <button type="button" className="icon-btn" onClick={() => move(idx, idx - 1)} disabled={idx === 0} title="Subir">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 14l5-5 5 5H7z"/></svg>
                </button>
                <button type="button" className="icon-btn" onClick={() => move(idx, idx + 1)} disabled={idx === rows.length - 1} title="Bajar">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
                </button>
                <button type="button" className="icon-btn danger" onClick={() => removeRow(idx)} disabled={rows.length === 1} title="Eliminar">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 7h12v2H6zM8 9h2v8H8V9zm6 0h2v8h-2V9zM9 4h6l1 2H8l1-2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensajes */}
        {hasDuplicates && <div className="msg warn">No repitas el mismo ejercicio.</div>}
        {error && <div className="msg error">{error}</div>}
        {success && <div className="msg ok">{success}</div>}

        {/* Preview */}
        {clean.length > 0 && (
          <div className="preview">
            <h4>Vista previa</h4>
            <ol>
              {clean.map((id, i) => (
                <li key={i}>{options.find(o => o.id === id)?.label || "Ejercicio"}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Guardar */}
        <div className="footer">
          <button type="submit" className="btn primary" disabled={!canSubmit}>
            {saving ? "Guardando…" : "Guardar rutina"}
          </button>
        </div>
      </form>
    </div>
  );
}
