import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para validar campos
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Validar email
    if (!email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de correo inválido.";
    }

    // Validar contraseña
    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // No continúa si hay errores
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
        <p className="subtitle">
          Bienvenido de nuevo, por favor ingresa tus datos
        </p>

        <form className="form" onSubmit={handleLogin}>
          {/* Campo de correo */}
          <div>
            <label className="label">Correo</label>
            <input
              type="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Campo de contraseña */}
          <div>
            <label className="label">Contraseña</label>
            <input
              type="password"
              className={`input ${errors.password ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Botón de ingreso */}
          <button
            className="btn-primary"
            type="submit"
            disabled={loading || !email || !password}
          >
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
