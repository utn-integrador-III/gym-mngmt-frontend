import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './pages/auth/Login';
import './styles/auth/login.css';
import CreateExercise from './pages/trainers/CreateExercise';
import './styles/trainers/CreateExercise.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
//<CreateExercise /> 


reportWebVitals();
