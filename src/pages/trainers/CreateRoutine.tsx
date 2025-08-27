import { useEffect, useState } from "react";
import { getExercises, Exercise } from "../../services/exercisesService";
import { createDailyRoutine } from "../../services/dailyRoutinesService";

export default function CreateRoutine() {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [numExercises, setNumExercises] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ejemplo: crea una "rutina" por cada ejercicio seleccionado (ajusta a tu API real)
      await Promise.all(
        selectedExercises
          .filter(Boolean)
          .map((exerciseId) => createDailyRoutine({ name: "Nueva rutina", id_exercise: exerciseId }))
      );
      alert("Rutina(s) creada(s)");
      setNumExercises(1);
      setSelectedExercises([""]);
    } catch (e) {
      console.error(e);
      alert("Error creando rutina");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Rutina</h2>

      <label>Cantidad de ejercicios</label>
      <input
        type="number"
        min={1}
        value={numExercises}
        onChange={(e) => setNumExercises(Number(e.target.value))}
      />

      {Array.from({ length: numExercises }).map((_, idx) => (
        <div key={idx}>
          <label>Ejercicio #{idx + 1}</label>
          <select
            value={selectedExercises[idx] || ""}
            onChange={(e) => handleChangeExercise(idx, e.target.value)}
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

      <button type="submit">Guardar</button>
    </form>
  );
}
