import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/trainers/editRoutine.css";

import { getExercises, type Exercise } from "../../services/exercisesService";
import {
  getDailyRoutines,
  updateDailyRoutine,
  deleteDailyRoutine,
  type Routine,
} from "../../services/dailyRoutinesService";

const MAX_EXERCISES = 8;
const TRAINER_MENU_PATH = "/TrainerMenu";
const coachId = "687e06685d26f6a1fe30c0a5";

// Normaliza id (string o { $oid })
const rid = (r: any) =>
  typeof r?._id === "string" ? r._id : (r?._id?.$oid ?? "");

export default function EditRoutine() {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  // form
  const [name, setName] = useState("");
  const [rows, setRows] = useState<string[]>([]);

  // ui
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadRoutines = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exs, rts] = await Promise.all([getExercises(), getDailyRoutines()]);
      setExercises(exs || []);
      setRoutines(rts || []);
      if (selectedId && !rts.some((r: any) => rid(r) === selectedId)) {
        setSelectedId("");
      }
    } catch (e) {
      console.error(e);
      setError("No se cargaron ejercicios o rutinas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = useMemo(
    () => routines.find((r: any) => rid(r) === selectedId) || null,
    [routines, selectedId]
  );

  useEffect(() => {
    if (!current) {
      setName("");
      setRows([]);
      return;
    }
    setName((current as any).name || "");
    const ids = Array.isArray((current as any).id_exercise)
      ? (current as any).id_exercise
      : [];
    setRows(ids.length ? ids : [""]);
  }, [current]);

  const options = useMemo(
    () => exercises.map((e) => ({ id: e._id, label: e.name })),
    [exercises]
  );

  const allSelected = rows.length > 0 && rows.every((id) => !!id);
  const clean = rows.filter(Boolean);
  const hasDuplicates = new Set(clean).size !== clean.length;
  const canAddRow = rows.length < MAX_EXERCISES;
  const canSubmit =
    !!selectedId && !!name.trim() && allSelected && !hasDuplicates && !saving;

  const addRow = () => setRows((r) => (r.length < MAX_EXERCISES ? [...r, ""] : r));
  const removeRow = (idx: number) =>
    setRows((r) => (r.length === 1 ? r : r.filter((_, i) => i !== idx)));
  const changeRow = (idx: number, value: string) =>
    setRows((r) => {
      const cp = [...r];
      cp[idx] = value;
      return cp;
    });
  const move = (from: number, to: number) =>
    setRows((r) => {
      if (to < 0 || to >= r.length) return r;
      const cp = [...r];
      const [item] = cp.splice(from, 1);
      cp.splice(to, 0, item);
      return cp;
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!canSubmit) {
      if (!selectedId) setError("Selecciona una rutina.");
      else if (!name.trim()) setError("La rutina necesita un nombre.");
      else if (!allSelected) setError("Completa todas las filas.");
      else if (hasDuplicates) setError("No se permiten ejercicios duplicados.");
      return;
    }

    try {
      setSaving(true);

      await updateDailyRoutine(selectedId, {
        id_coach: current?.id_coach ?? coachId,
        id_exercise: rows,
        name: name.trim(),
      });

      setSuccess("¡Rutina actualizada!");
      setRoutines((prev: any[]) =>
        prev.map((r) =>
          rid(r) === selectedId
            ? { ...r, name: name.trim(), id_exercise: rows }
            : r
        )
      );
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Error al actualizar la rutina.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm("¿Eliminar esta rutina? Esta acción no se puede deshacer.")) return;
  
    setError(null);
    setSuccess(null);
    try {
      setDeleting(true);
      await deleteDailyRoutine(selectedId); 
      setSuccess("Rutina eliminada.");
      await loadRoutines();
      setSelectedId("");
      setName("");
      setRows([]);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "No se pudo eliminar la rutina.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="er-container">
      <div className="er-toolbar">
        <button type="button" className="btn back" onClick={() => navigate(TRAINER_MENU_PATH)}>
          ← Volver al menú
        </button>
      </div>

      <h2 className="er-title">Editar / Eliminar Rutina</h2>

      <form className="er-card" onSubmit={handleSave}>
        <div className="form-row">
          <label className="lbl" htmlFor="routine">Rutina</label>
          <select
            id="routine"
            className={`in sel ${!selectedId ? "is-placeholder" : ""}`}
            value={selectedId}
            onChange={(e) => {
              const val = e.target.value.trim();
              setSelectedId(val);
              const chosen: any = routines.find((r: any) => rid(r) === val);
              alert(
                [
                  "▶ DEBUG selección de rutina",
                  `selectedId (value): ${val}`,
                  `typeof selectedId: ${typeof val}`,
                  `24hex? ${/^[0-9a-fA-F]{24}$/.test(val)}`,
                  `raw _id del listado: ${JSON.stringify(chosen?._id)}`
                ].join("\n")
              );
            }}
            required
          >
            <option value="" disabled hidden>Seleccionar rutina…</option>
            {routines.map((r: any) => {
              const id = rid(r);
              return (
                <option key={id} value={id}>
                  {r.name} {Array.isArray(r.id_exercise) ? `(${r.id_exercise.length})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        {selectedId && (
          <>
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

            <div className="rows">
              {rows.length === 0 && (
                <div className="msg warn">Esta rutina no tiene ejercicios aún.</div>
              )}

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
                    {options.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>

                  <div className="row-actions">
                    <button type="button" className="icon-btn" onClick={() => move(idx, idx - 1)} disabled={idx === 0} title="Subir">
                      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 14l5-5 5 5H7z"/></svg>
                    </button>
                    <button type="button" className="icon-btn" onClick={() => move(idx, idx + 1)} disabled={idx === rows.length - 1} title="Bajar">
                      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
                    </button>
                    <button type="button" className="icon-btn danger" onClick={() => removeRow(idx)} disabled={rows.length === 1} title="Eliminar">
                      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 7h12v2H6zM8 9h2v8H8V9zm6 0h2v8h-2V9zM9 4h6l1 2H8l1-2z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasDuplicates && <div className="msg warn">No repitas el mismo ejercicio.</div>}
            {error && <div className="msg error">{error}</div>}
            {success && <div className="msg ok">{success}</div>}

            <div className="footer">
              <button type="button" className="btn danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Eliminando…" : "Eliminar rutina"}
              </button>
              <button type="submit" className="btn primary" disabled={!canSubmit || saving}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </>
        )}
      </form>

      {loading && <div className="loading">Cargando…</div>}
    </div>
  );
}
