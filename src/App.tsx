// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import IndexRedirect from './pages/auth/IndexRedirect';
import CreateExercise from './pages/trainers/CreateExercise';
import DeleteExercise from './pages/trainers/DeleteExercise';
import CreateRoutine from './pages/trainers/CreateRoutine';
import TrainerMenu from './pages/trainers/TrainerMenu';
import ClientList from './pages/trainers/ClientList';
import AssignRoutine from './pages/trainers/AssignRoutine';
import ClientTodayRoutine from './pages/clients/ClientTodayRoutine'; 
import UserProfile from './pages/profile/UserProfile';
import EditRoutine from './pages/trainers/EditRoutine';
import AdminAddCoach from './pages/Admin/AdminAddCoach';


import './styles/auth/login.css';
import './styles/auth/register.css';
import './styles/trainers/createExercise.css';
import './styles/trainers/deleteExercise.css';
import './styles/trainers/createRoutine.css';
import './styles/trainers/menu.css';
import './styles/trainers/clientList.css';
import './styles/trainers/assignRoutine.css';
import './styles/clients/todayRoutine.css';
import './styles/profile/userProfile.css';
import './styles/trainers/editRoutine.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/redirect" element={<IndexRedirect />} />
        <Route path="/createExercise" element={<CreateExercise />} />
        <Route path="/deleteExercise" element={<DeleteExercise />} />
        <Route path="/createRoutine" element={<CreateRoutine />} />
        <Route path="/trainerMenu" element={<TrainerMenu />} />
        <Route path="/clientList" element={<ClientList />} />
        <Route path="/assignRoutine" element={<AssignRoutine />} />
        <Route path="/clientTodayRoutine" element={<ClientTodayRoutine />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/editRoutine" element={<EditRoutine />} />
        <Route path="/admin" element={<AdminAddCoach />} />      
      </Routes>

    </BrowserRouter>
    
  );
  
}

export default App;
