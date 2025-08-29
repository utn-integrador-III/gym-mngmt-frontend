import { useEffect, useMemo, useState } from 'react';
import '../../styles/clients/todayRoutine.css';
import {
  getAssignedRoutines,
  updateAssignedRoutine,
  AssignedRoutine,
} from '../../services/assignedRoutinesService';
import { getDailyRoutines, Routine } from '../../services/dailyRoutinesService';

const clientId = '687f715c6811be42dffd67b8';
const spanishDays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export default function ClientTodayRoutine() {
  const [day, setDay] = useState<string>(() => spanishDays[new Date().getDay()] ?? 'lunes');
  const [assignedRoutines, setAssignedRoutines] = useState<AssignedRoutine[]>([]);
  const [routinesMap, setRoutinesMap] = useState<Record<string, string>>({});
  const [noteInput, setNoteInput] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<AssignedRoutine | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingDone, setUpdatingDone] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const days = useMemo(() => ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'], []);

  // Validación para cambiar el día
  const handleSetDay = (newDay: string) => {
    if (!days.includes(newDay)) {
      alert('Día inválido seleccionado');
      return;
    }
    setDay(newDay);
  };

  // Cargar rutinas asignadas
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [assigned, routines] = await Promise.all([
          getAssignedRoutines(),
          getDailyRoutines(),
        ]);

        const clientOnly = assigned.filter((r) => r.id_client === clientId);
        setAssignedRoutines(clientOnly);

        const map: Record<string, string> = {};
        routines.forEach((r: Routine) => {
          map[r._id] = r.name;
        });
        setRoutinesMap(map);
      } catch (e) {
        console.error(e);
        setError(
          'No se pudo cargar las rutinas. Verifica tu conexión o contacta con un entrenador.'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Detectar rutina seleccionada según el día
  useEffect(() => {
    const match = assignedRoutines.find((r) => r.dayofweek === day) || null;
    setSelectedRoutine(match);
    setNoteInput(match?.notes ?? '');
  }, [day, assignedRoutines]);

  // Validar y alternar estado "done"
  const handleToggleDone = async () => {
    if (!selectedRoutine || updatingDone) return;
    if (!selectedRoutine._id) {
      alert('Error: rutina inválida.');
      return;
    }

    setUpdatingDone(true);
    try {
      const updated = await updateAssignedRoutine(selectedRoutine._id, {
        done: !selectedRoutine.done,
      });
      setAssignedRoutines((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    } catch (e) {
      console.error(e);
      alert('Error al actualizar el estado de la rutina.');
    } finally {
      setUpdatingDone(false);
    }
  };

  // Validar y guardar nota
  const handleSaveNote = async () => {
    if (!selectedRoutine || savingNote) return;

    const trimmedNote = noteInput.trim();
    if (trimmedNote.length === 0) {
      alert('La nota no puede estar vacía o solo contener espacios.');
      return;
    }
    if (trimmedNote.length > 500) {
      alert('La nota no puede superar los 500 caracteres.');
      return;
    }

    setSavingNote(true);
    try {
      const updated = await updateAssignedRoutine(selectedRoutine._id, {
        notes: trimmedNote,
      });
      setAssignedRoutines((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    } catch (e) {
      console.error(e);
      alert('Error al guardar la nota.');
    } finally {
      setSavingNote(false);
    }
  };

  // Progreso del usuario
  const progress = useMemo(() => {
    const total = assignedRoutines.length || 1;
    const done = assignedRoutines.filter((r) => r.done).length;
    return Math.round((done / total) * 100);
  }, [assignedRoutines]);

  return (
    <div className="routine-container">
      <h2 className="routine-brand">GYM KSG</h2>

      <div className="day-tabs" role="tablist" aria-label="Días de la semana">
        {days.map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={d === day}
            className={`day-tab ${d === day ? 'active-day' : ''}`}
            onClick={() => handleSetDay(d)}
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
                  ? routinesMap[selectedRoutine.id_dailyroutineexercise] ?? 'Nombre no disponible'
                  : 'No routine assigned'}
              </p>

              <div className="toggle-box">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!!selectedRoutine?.done}
                    onChange={handleToggleDone}
                    disabled={!selectedRoutine || updatingDone}
                    aria-label="Mark as done"
                  />
                  <span className="slider" />
                </label>
                <span className="toggle-label">
                  {selectedRoutine?.done ? 'Done' : 'Pending'}
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
                  disabled={
                    savingNote ||
                    noteInput.trim() === (selectedRoutine.notes ?? '')
                  }
                >
                  {savingNote ? 'Saving…' : 'Save Note'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
