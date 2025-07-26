// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import CreateExercise from './pages/trainers/CreateExercise';
import DeleteExercise from './pages/trainers/DeleteExercise';
import CreateRoutine from './pages/trainers/CreateRoutine';
import TrainerMenu from './pages/trainers/TrainerMenu';


import './styles/auth/login.css';
import './styles/trainers/createExercise.css';
import './styles/trainers/deleteExercise.css';
import './styles/trainers/createRoutine.css';
import './styles/trainers/menu.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createExercise" element={<CreateExercise />} />
        <Route path="/deleteExercise" element={<DeleteExercise />} />
        <Route path="/createRoutine" element={<CreateRoutine />} />
        <Route path="/trainerMenu" element={<TrainerMenu />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
