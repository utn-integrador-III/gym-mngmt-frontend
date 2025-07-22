// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import CreateExercise from './pages/trainers/CreateExercise';
import DeleteExercise from './pages/trainers/DeleteExercise';
import './styles/auth/login.css';
import './styles/trainers/CreateExercise.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createExercise" element={<CreateExercise />} />
        <Route path="/deleteExercise" element={<DeleteExercise />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
