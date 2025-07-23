import React, { useState } from 'react';
import '../../styles/trainers/CreateRoutine.css';
import logo from '../../assets/images/logo.jpg';


const CreateRoutine: React.FC = () => {
  const [numExercises, setNumExercises] = useState(4);

  const renderExerciseSelectors = () => {
    return Array.from({ length: numExercises }, (_, i) => (
      <select key={i} className="exercise-select">
        <option disabled>Exercise {i + 1}</option>
        <option>Push-ups</option>
        <option>Squats</option>
        <option>Planks</option>
        <option>Burpees</option>
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
          placeholder="Routines name"
          className="input"
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

        <button className="save-button">Save</button>
      </div>

     {/* Barra inferior */}
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
