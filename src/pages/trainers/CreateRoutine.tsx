import React, { useEffect, useState } from 'react';
import '../../styles/trainers/createRoutine.css';
import logo from '../../assets/images/logo.jpg';

const EXERCISES_API_URL = 'http://localhost:8000/exercises';
const ROUTINE_API_URL = 'http://localhost:8000/daily_routines';

// ID del entrenador (puedes cambiarlo según tu sesión)
const ID_COACH = '687f68f68746625144eeffca';

const CreateRoutine: React.FC = () => {
  const [numExercises, setNumExercises] = useState(4);
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [routineName, setRoutineName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(EXERCISES_API_URL);
        const data = await res.json();
        setExerciseList(data);
        setSelectedExercises(Array(numExercises).fill(''));
      } catch (error) {
        console.error('Error al obtener ejercicios:', error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    setSelectedExercises(Array(numExercises).fill(''));
  }, [numExercises]);

  const handleExerciseChange = (index: number, value: string) => {
    const updated = [...selectedExercises];
    updated[index] = value;
    setSelectedExercises(updated);
  };

  const handleSaveRoutine = async () => {
    if (!routineName.trim()) {
      setStatusMessage('❌ Debes ingresar un nombre para la rutina.');
      return;
    }

    if (selectedExercises.some((id) => !id)) {
      setStatusMessage('❌ Debes seleccionar todos los ejercicios.');
      return;
    }

    try {
      setStatusMessage('');

      // Enviar todas las solicitudes en paralelo
      await Promise.all(
        selectedExercises.map((exerciseId) =>
          fetch(ROUTINE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_coach: ID_COACH,
              id_exercise: exerciseId,
              name: routineName,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Error ${res.status}: ${errorText}`);
            }
          })
        )
      );

      setStatusMessage('✅ Rutina guardada exitosamente.');
      setRoutineName('');
      setSelectedExercises(Array(numExercises).fill(''));
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      setStatusMessage('❌ Error al guardar la rutina. Ver consola para más detalles.');
    }
  };

  const renderExerciseSelectors = () => {
    return Array.from({ length: numExercises }, (_, i) => (
      <select
        key={i}
        className="exercise-select"
        value={selectedExercises[i] || ''}
        onChange={(e) => handleExerciseChange(i, e.target.value)}
      >
        <option value="">Selecciona ejercicio {i + 1}</option>
        {exerciseList.map((exercise) => (
          <option key={exercise._id} value={exercise._id}>
            {exercise.name}
          </option>
        ))}
      </select>
    ));
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="title">GYM KSG</h1>
      </header>

      {/* Form */}
      <div className="form-box">
        <h2 className="title">Create routine</h2>

        <input
          type="text"
          placeholder="Routine name"
          className="input"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />

        <p className="instruction">
          Select the number of exercises to use. <br />
          Min 4 - Max 9
        </p>

        <select
          className="exercise-count-select"
          value={numExercises}
          onChange={(e) => setNumExercises(parseInt(e.target.value))}
        >
          {Array.from({ length: 6 }, (_, i) => i + 4).map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>

        <div className="exercise-select-container">
          {renderExerciseSelectors()}
        </div>

        <button className="save-button" onClick={handleSaveRoutine}>Save</button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <button className="nav-button"><i className="fas fa-home"></i></button>
        <button className="nav-button"><i className="fas fa-user-plus"></i></button>
        <button className="nav-button"><i className="fas fa-clipboard-list"></i></button>
        <button className="nav-button"><i className="fas fa-user"></i></button>
      </div>
    </div>
  );
};

export default CreateRoutine;
