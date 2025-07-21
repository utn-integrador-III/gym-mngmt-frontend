import React, { useState } from "react";
import '../../styles/trainers/CreateExercise.css';
import logo from '../../assets/images/logo.jpg';

const CreateExercise: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description });
    // Aquí podrías agregar lógica para enviar los datos al backend
  };

  return (
    <div className="create-exercise-container">
      <main className="content">
        <header className="header">
            <img src={logo} alt="Logo" className="login-logo"  />
            <h1 className="title">GYM KSG</h1>
        </header>
        
        <form className="form" onSubmit={handleSubmit}>
        <h2 className="page-title">Create exercise</h2>
          <label className="label">Name</label>
          <input
            className="input"
            type="text"
            placeholder="Value"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="label">Description</label>
          <textarea
            className="textarea"
            placeholder="You can add a link to guide the clients"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
        <footer className="bottom-nav">
            <button className="nav-item">🏠</button>
            <button className="nav-item">➕👤</button>           
            <button className="nav-item">📒</button>
            <button className="nav-item">👤</button>
        </footer>
      </main>

      
    </div>
  );
};

export default CreateExercise;
