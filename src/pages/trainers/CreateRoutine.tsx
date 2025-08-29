import { useEffect, useState, useMemo } from "react";
import { getExercises, Exercise } from "../../services/exercisesService";
import { createDailyRoutine } from "../../services/dailyRoutinesService";

export default function CreateRoutine() {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [numExercises, setNumExercises] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_EXERCISES = 20;

  // Cargar ejercicios
  useEffect(() => {
    (async () => {
      try {
        const data = await getExercises();
        setExerciseList(data);
        setSelectedExercises(Array(numExercises).fill(""));
      } catch (e) {
        console.error(e);
        alert("Error cargando ejercicios");
      }
    })();
  }, []);

  // Ajustar array de seleccionados si cambia numExercises
  useEffect(() => {
    setSelectedExercises((prev) => {
      const next = Array(numExercises).fill("");
      for (let i = 0; i < Math.min(prev.length, next.length); i++) next[i] = prev[i];
      return next;
    });
  }, [numExercises]);

  const handleChangeExercise = (idx: number, value: string) => {
    setSelectedExercises((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  // Validaciones
  const allSelected = selectedExercises.every((ex) => ex);
  const hasDuplicates = new Set(selectedExercises.filter(Boolean)).size !== selectedExercises.filter(Boolean).length;
  const numValid = numExercises >= 1 && numExercises <= MAX_EXERCISES;

  const canSubmit = allSelected && !hasDuplicates && numValid && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      if (!numValid) setError(`La cantidad de ejercicios debe ser entre 1 y ${MAX_EXERCISES}.`);
      else if (!allSelected) setError("Debes seleccionar todos los ejercicios.");
      else if (hasDuplicates) setError("No se permiten ejercicios duplicados.");
      return;
    }

    try {
      setSaving(true);
      await Promise.all(
        selectedExercises.map((exerciseId) =>
          createDailyRoutine({ name: "Nueva rutina", id_exercise: exerciseId })
        )
      );
      alert("Rutina(s) creada(s) con éxito");
      setNumExercises(1);
      setSelectedExercises([""]);
    } catch (e) {
      console.error(e);
      setError("Error creando rutina(s).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Rutina</h2>

      <label>Cantidad de ejercicios</label>
      <input
        type="number"
        min={1}
        max={MAX_EXERCISES}
        value={numExercises}
        onChange={(e) => setNumExercises(Number(e.target.value))}
      />
      {!numValid && <div className="error-text">Debe ser entre 1 y {MAX_EXERCISES}.</div>}

      {Array.from({ length: numExercises }).map((_, idx) => (
        <div key={idx}>
          <label>Ejercicio #{idx + 1}</label>
          <select
            value={selectedExercises[idx] || ""}
            onChange={(e) => handleChangeExercise(idx, e.target.value)}
            required
          >
            <option value="">-- Seleccionar --</option>
            {exerciseList.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasDuplicates && <div className="error-text">No se permiten ejercicios duplicados.</div>}
      {error && <div className="error-text">{error}</div>}

      <button type="submit" disabled={!canSubmit}>
        {saving ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
