import React, { useState, useEffect } from "react";
import logo from '../../assets/images/logo.jpg';
import '../../styles/trainers/editRoutine.css';
import { getExercises } from "../../api/exercisesApi"; // tu función para traer ejercicios
import { updateRoutine } from "../../api/daily_routinesApi"; // tu nueva función para editar rutinas

const EditRoutine: React.FC = () => {
  const [numExercises, setNumExercises] = useState(4);
  const [routineName, setRoutineName] = useState("");
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar ejercicios desde API
  useEffect(() => {
    const fetchData = async () => {
      const data = await getExercises();
      if (!data.error) {
        setAvailableExercises(data);
      }
    };
    fetchData();
  }, []);

  // Ajustar el array cuando cambia la cantidad
  useEffect(() => {
    setSelectedExercises((prev) =>
      Array.from({ length: numExercises }, (_, i) => prev[i] || "")
    );
  }, [numExercises]);

  const handleExerciseChange = (index: number, value: string) => {
    setSelectedExercises((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    if (!routineName.trim()) {
      alert("Por favor, ingresa un nombre para la rutina");
      return;
    }

    if (selectedExercises.some((ex) => !ex)) {
      alert("Por favor, selecciona todos los ejercicios");
      return;
    }

    setLoading(true);

    // Aquí podrías hacer múltiples llamadas si tu backend requiere una rutina por ejercicio
    for (const exerciseId of selectedExercises) {
      const res = await updateRoutine(
        "ID_DE_RUTINA", // aquí iría el ID real
        "ID_DEL_COACH", // aquí iría el coach actual
        exerciseId,
        routineName
      );
      if (res.error) {
        alert(`Error: ${res.error}`);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    alert("Rutina actualizada correctamente");
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <img
          src={logo}
          alt="Logo"
          className="login-logo"
        />
        <h2>GYM KSG</h2>
      </div>

      {/* Title */}
      <h3 className="title">Edit routine</h3>

      {/* Routine Name */}
      <input
        type="text"
        className="input"
        placeholder="Routine name"
        value={routineName}
        onChange={(e) => setRoutineName(e.target.value)}
      />

      {/* Selector */}
      <p className="subtitle">
        Select the number of exercises to use.<br />
        Min 4 - Max 9
      </p>

      <select
        className="select"
        value={numExercises}
        onChange={(e) => setNumExercises(Number(e.target.value))}
      >
        {Array.from({ length: 6 }, (_, i) => i + 4).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* Exercise dropdowns */}
      <div className="exercise-list">
        {selectedExercises.map((exercise, index) => (
          <details key={index} className="exercise">
            <summary>Exercise {index + 1}</summary>
            <div className="exercise-content">
              <select
                className="select"
                value={exercise}
                onChange={(e) => handleExerciseChange(index, e.target.value)}
              >
                <option value="">-- Select Exercise --</option>
                {availableExercises.map((ex: any) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.difficulty})
                  </option>
                ))}
              </select>
            </div>
          </details>
        ))}
      </div>

      {/* Save Button */}
      <button className="save-btn" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {/* Bottom Nav */}
      <div className="bottom-navigation">
        <button className="nav-button"><i className="fas fa-home"></i></button>
        <button className="nav-button"><i className="fas fa-user-plus"></i></button>
        <button className="nav-button"><i className="fas fa-clipboard-list"></i></button>
        <button className="nav-button"><i className="fas fa-user"></i></button>
      </div>
    </div>
  );
};

export default EditRoutine;
