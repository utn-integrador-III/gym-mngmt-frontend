import React, { useEffect, useState } from 'react';
import '../../styles/trainers/deleteExercise.css';
import logo from '../../assets/images/logo.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

//import { deleteExercise, getExercises } from '../../api/exerciseApi';

const API_URL = 'http://localhost:8000/exercises'; // o tu endpoint real

export const getExercises = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('No se pudieron obtener los ejercicios');
    return await res.json();
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    return [];
  }
};

export const deleteExercise = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('No se pudo eliminar el ejercicio');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Error desconocido al eliminar' };
  }
};


interface Exercise {
  _id: string;
  name: string;
  description: string;
}

const DeleteExercise: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await getExercises();
      setExercises(data);
    };
    fetchExercises();
  }, []);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedId) {
      alert('Please select an exercise to delete');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this exercise?');
    if (!confirmDelete) return;

    const result = await deleteExercise(selectedId);
    if (result.success) {
      alert('Exercise deleted successfully!');
      setExercises((prev) => prev.filter((ex) => ex._id !== selectedId));
      setSelectedId('');
    } else {
      alert(`Error: ${result.error}`);
    }
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
          <h2 className="page-title">Delete Exercise</h2>
          <form className="form" onSubmit={handleDelete}>
            <label className="label">Select Exercise</label>
            <select
              className="input"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">-- Choose an exercise --</option>
              {exercises.map((exercise) => (
                <option key={exercise._id} value={exercise._id}>
                  {exercise.name}
                </option>
              ))}
            </select>

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
