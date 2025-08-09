import React, { useState } from "react";
import '../../styles/trainers/createExercise.css';
import logo from '../../assets/images/logo.jpg';
/*import { createExercise } from '../../conection/exerciseService';*/
/*const API_URL = "http://127.0.0.1:8000/exercises/";*/

const createExercise = async (name: string, description: string) => {
  try {
    const res = await fetch("http://localhost:8000/exercises/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error creando ejercicio");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en createExercise:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

const CreateExercise = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (!name || !description) {
      alert("Completa todos los campos");
      return;
    }

    const result = await createExercise(name, description);
    console.log("Resultado:", result);

    if (result.error) {
      alert("Error: " + result.error);
    } else {
      alert("Ejercicio creado con éxito");
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="create-exercise-container">
      <div className="create-card">
        <header className="header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="title">GYM KSG</h1>
        </header>

        <main className="content">
          <h2 className="page-title">Create exercise</h2>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
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
