import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/login.css';
import logo from '../../assets/images/logo.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const loginData = {
    email,
    password
  };

  try {
    const res = await fetch("http security mod /login ", { // Esperando xd
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });

    const result = await res.json();
    

    if (res.ok && result.token) {
      // Save token in localStorage
      localStorage.setItem("session_token", result.token);
      alert("Login exitoso");

      navigate("/index"); // Redirect to index


    } else {
      alert(result.detail || "Credenciales inválidas");
    }
  } catch (error) {
    console.error("[ERROR LOGIN]", error);
    alert("Error al intentar iniciar sesión");
  }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Iniciar sesión
        </button>

        <button
          type="button"
          className="register-link"
          onClick={() => navigate('/register')}
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
}
