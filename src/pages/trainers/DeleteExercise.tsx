import React, { useState } from 'react';
import '../../styles/trainers/deleteExercise.css';
import logo from '../../assets/images/logo.jpg';

const DeleteExercise: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Deleting:', { name, description });
  };

  return (
    <div className="delete-exercise-container">
      <div className="delete-card">
        {/* Encabezado */}
        <header className="header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="title">GYM KSG</h1>
        </header>

        {/* Formulario */}
        <main className="content">
          <h2 className="page-title">Delete exercise</h2>
          <form className="form" onSubmit={handleDelete}>
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
              placeholder="It´s the link"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button type="submit" className="delete-button">
              DELETE
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

export default DeleteExercise;
