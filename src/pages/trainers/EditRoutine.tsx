import { useEffect, useMemo, useState } from 'react';
import logo from '../../assets/images/logo.jpg';
import '../../styles/trainers/editRoutine.css';
import { getExercises } from "../../services/exercisesService";
import { getDailyRoutines } from "../../services/dailyRoutinesService";

const EditRoutine: React.FC = () => {
  const [numExercises, setNumExercises] = useState(1);
  const [exercises, setExercises] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [exs, rts] = await Promise.all([getExercises(), getDailyRoutines()]);
        setExercises(exs);
        setRoutines(rts);
        setSelectedRoutines(Array(1).fill("")); // inicializamos con 1 ejercicio
      } catch (e) {
        console.error(e);
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Ajustar array de rutinas seleccionadas al cambiar número de ejercicios
  useEffect(() => {
    setSelectedRoutines(prev => {
      const next = Array(numExercises).fill("");
      for (let i = 0; i < Math.min(prev.length, next.length); i++) next[i] = prev[i];
      return next;
    });
  }, [numExercises]);

  const handleChangeRoutine = (idx: number, value: string) => {
    setSelectedRoutines(prev => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  // Validaciones
  const allFilled = selectedRoutines.every(r => r);
  const hasDuplicates = new Set(selectedRoutines.filter(Boolean)).size !== selectedRoutines.filter(Boolean).length;
  const canSubmit = allFilled && !hasDuplicates && numExercises > 0 && numExercises <= exercises.length;

  const handleSubmit = () => {
    if (!canSubmit) {
      alert("Revisa que todos los campos estén llenos, sin duplicados y cantidad correcta");
      return;
    }
    // Aquí iría la llamada a la API para guardar la rutina editada
    console.log("Rutina guardada:", selectedRoutines);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="msg error">{error}</div>;

  return (
    <div className="edit-routine">
      <img src={logo} alt="logo" />
      <div>Ejercicios: {exercises.length} | Rutinas: {routines.length}</div>

      <div>
        <label>Cantidad de ejercicios: </label>
        <input
          type="number"
          value={numExercises}
          min={1}
          max={exercises.length}
          onChange={(e) => setNumExercises(Number(e.target.value))}
        />
      </div>

      {Array.from({ length: numExercises }).map((_, idx) => (
        <div key={idx}>
          <label>Ejercicio #{idx + 1}</label>
          <select
            value={selectedRoutines[idx] || ""}
            onChange={(e) => handleChangeRoutine(idx, e.target.value)}
          >
            <option value="">-- Seleccionar rutina --</option>
            {routines.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>
      ))}

      {hasDuplicates && <div className="msg warn">No puede haber rutinas duplicadas</div>}

      <button onClick={handleSubmit} disabled={!canSubmit}>
        Guardar Rutina
      </button>
    </div>
  );
};

export default EditRoutine;
