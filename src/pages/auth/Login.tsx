import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      console.log("Token:", response.token);
      alert(`Bienvenido, ${response.user.email}`);
      localStorage.setItem("token", response.token);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Credenciales incorrectas o error en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card">
        <div className="logo">G</div>

        <h2 className="title">Iniciar sesión</h2>
        <p className="subtitle">Bienvenido de nuevo, por favor ingresa tus datos</p>

        <form className="form" onSubmit={handleLogin}>
          <div>
            <label className="label">Correo</label>
            <input
              type="email"
              className="input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <div className="footer">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
}
