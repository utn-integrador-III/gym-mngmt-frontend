import { useEffect, useMemo, useState } from "react";
import { getExercises, deleteExercise, type Exercise } from "../../services/exercisesService";
import "../../styles/trainers/createExercise.css";   // reutilizamos estilos base
import "../../styles/trainers/deleteExercise.css";   // modal y detalles

export default function DeleteExercise() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (e: any) {
        setError(e?.message || "Error cargando ejercicios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? exercises.filter(e => e.name?.toLowerCase().includes(q)) : exercises;
  }, [exercises, query]);

  const selected = useMemo(
    () => exercises.find(e => e._id === selectedId) || null,
    [exercises, selectedId]
  );

  const openConfirm = () => {
    if (!selectedId) return;
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      setDeleting(true);
      await deleteExercise(selectedId);
      setExercises(prev => prev.filter(e => e._id !== selectedId));
      setSelectedId("");
      setOk("Ejercicio eliminado ✅");
      setTimeout(() => setOk(null), 2200);
    } catch (e: any) {
      setError(e?.message || "Error eliminando ejercicio");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <div className="create-wrap"><div className="card">Cargando…</div></div>;

  return (
    <div className="create-wrap">
      <div className="card fancy">
        <div className="card-head">
          <div className="logo-bubble" aria-hidden>🗑️</div>
          <div>
            <h2 className="title">Eliminar ejercicio</h2>
            <p className="subtitle">Busca y elimina un ejercicio del catálogo.</p>
          </div>
        </div>

        <div className="form">
          <div className="field">
            <label className="label">Buscar</label>
            <input
              className="input"
              placeholder="Escribe para filtrar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="hint">{filtered.length} resultado(s)</div>
          </div>

          <div className="field">
            <label className="label">Ejercicio</label>
            <select
              className="input"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">-- Seleccionar --</option>
              {filtered.map(e => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="preview">
              <div className="preview-title">Seleccionado</div>
              <div className="preview-card">
                <div className="preview-icon">💪</div>
                <div>
                  <div className="preview-name">{selected.name}</div>
                  <div className="preview-desc">{selected.description || "Sin descripción"}</div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="msg error">{error}</div>}

          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => window.history.back()}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={!selectedId}
              onClick={openConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {ok && <div className="toast ok">{ok}</div>}

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>¿Eliminar “{selected?.name || "este ejercicio"}”?</h3>
            <p style={{opacity:.85, marginTop:6}}>
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>
              <button className="btn danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
