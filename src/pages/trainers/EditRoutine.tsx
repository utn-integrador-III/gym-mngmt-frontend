import { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.jpg';
import '../../styles/trainers/editRoutine.css';
import { getExercises } from "../../services/exercisesService";
import { getDailyRoutines } from "../../services/dailyRoutinesService";

const EditRoutine: React.FC = () => {
  const [numExercises, setNumExercises] = useState(4);
  const [exercises, setExercises] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [exs, rts] = await Promise.all([getExercises(), getDailyRoutines()]);
        setExercises(exs);
        setRoutines(rts);
      } catch (e) {
        console.error(e);
        alert("Error cargando datos.");
      }
    })();
  }, []);

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
          onChange={(e) => setNumExercises(Number(e.target.value))}
        />
      </div>
      {/* Tu UI actual aquí... */}
    </div>
  );
};

export default EditRoutine;
