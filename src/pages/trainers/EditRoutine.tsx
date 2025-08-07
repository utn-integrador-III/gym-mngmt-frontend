import React, { useState } from "react";
import '../../styles/trainers/editRoutine.css';

const EditRoutine: React.FC = () => {
  const [numExercises, setNumExercises] = useState(4);

  const exercises = Array.from({ length: numExercises }, (_, i) => `Exercise ${i + 1}`);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/69/69524.png" // Icono temporal
          alt="Gym Logo"
          className="logo"
        />
        <h2>GYM KSG</h2>
      </div>

      {/* Title */}
      <h3 className="title">Edit routine</h3>

      {/* Routine Name */}
      <input
        type="text"
        className="input"
        placeholder="Routines name"
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
        {exercises.map((exercise, index) => (
          <details key={index} className="exercise">
            <summary>{exercise}</summary>
            <div className="exercise-content">
              {/* Aquí podrías añadir inputs o descripciones */}
              Exercise details go here...
            </div>
          </details>
        ))}
      </div>

      {/* Save Button */}
      <button className="save-btn">Save</button>

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
