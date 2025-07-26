import React, { useState } from "react";
import '../../styles/trainers/createExercise.css';
import logo from '../../assets/images/logo.jpg';

const CreateExercise: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description });
  };

  return (
    <div className="create-exercise-container">
      {/* Tarjeta completa */}
      <div className="create-card">
        
        {/* Logo y título */}
        <header className="header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="title">GYM KSG</h1>
        </header>

        {/* Formulario */}
        <main className="content">
          <h2 className="page-title">Create exercise</h2>
          <form className="form" onSubmit={handleSubmit}>
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
        </main>
 {/* Barra inferior */}
        <div className="bottom-navigation">
          <button className="nav-button"><i className="fas fa-home"></i></button>
          <button className="nav-button"><i className="fas fa-user-plus"></i></button>
          <button className="nav-button"><i className="fas fa-clipboard-list"></i></button>
          <button className="nav-button"><i className="fas fa-user"></i></button>
        </div>
      </div>
    </div>

  );
};

export default CreateExercise;
