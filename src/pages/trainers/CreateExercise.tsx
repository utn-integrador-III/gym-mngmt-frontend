import { useState, useMemo } from "react";
import { createExercise } from "../../services/exercisesService";
import "../../styles/trainers/createExercise.css";

import { useNavigate } from "react-router-dom";  // ⬅️ arriba

const NAME_MAX = 60;
const DESC_MAX = 320;

export default function CreateExercise() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const nameLen = name.trim().length;
  const descLen = description.trim().length;

  const nameValid = nameLen >= 3 && nameLen <= NAME_MAX;
  const descValid = descLen <= DESC_MAX;
  const formValid = nameValid && descValid;

  const namePct = useMemo(() => Math.min(100, Math.round((nameLen / NAME_MAX) * 100)), [nameLen]);
  const descPct = useMemo(() => Math.min(100, Math.round((descLen / DESC_MAX) * 100)), [descLen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    if (!formValid) {
      setError("Revisa los campos marcados.");
      return;
    }
    try {
      setSaving(true);
      await createExercise({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setOk("Ejercicio creado ✅");
      setName("");
      setDescription("");
      // ocultar el toast luego de 2.5s
      setTimeout(() => setOk(null), 2500);
    } catch (err: any) {
      setError(err?.message ?? "Error creando ejercicio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-wrap">
      <div className="card fancy">
        <div className="card-head">
          <div className="logo-bubble" aria-hidden>🏋️</div>
          <div>
            <h2 className="title">Crear ejercicio</h2>
            <p className="subtitle">Agrega un nuevo ejercicio al catálogo.</p>
          </div>
          <span className="chip">Nuevo</span>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className={`field ${!nameValid && nameLen ? "invalid" : ""}`}>
            <label className="label">Nombre</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Push Ups"
              maxLength={NAME_MAX}
              required
              aria-invalid={!nameValid}
            />
            <div className="meter">
              <span style={{ width: `${namePct}%` }} />
            </div>
            <div className="hint">
              {nameLen}/{NAME_MAX} — mínimo 3 caracteres.
            </div>
          </div>

          {/* Descripción */}
          <div className={`field ${!descValid ? "invalid" : ""}`}>
            <label className="label">Descripción</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional (máx. 320)"
              maxLength={DESC_MAX}
              aria-invalid={!descValid}
            />
            <div className="meter">
              <span style={{ width: `${descPct}%` }} />
            </div>
            <div className="hint">
              {descLen}/{DESC_MAX}
            </div>
          </div>

          {/* Preview mini */}
          {nameLen > 0 && (
            <div className="preview">
              <div className="preview-title">Vista rápida</div>
              <div className="preview-card">
                <div className="preview-icon">💪</div>
                <div>
                  <div className="preview-name">{name.trim()}</div>
                  <div className="preview-desc">
                    {description.trim() || "Sin descripción"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="msg error">{error}</div>}

          <div className="actions">
          <button
              type="button"
              className="btn ghost"
              onClick={() => navigate(-1)}   // ⬅️ antes: history.back()
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={saving || !formValid}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      {/* Toast de éxito */}
      {ok && <div className="toast ok">{ok}</div>}
    </div>
  );
}
