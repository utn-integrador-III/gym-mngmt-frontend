import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexRedirect() {
  
    // esto es solo en lo que esperamos al modulo de seguridad 
  
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      navigate("/"); // Login
      return;
    }

    fetch("http://MODULO_SEGURIDAD/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.role === "Trainer") {
          navigate("/trainerMenu");
        } else if (data.role === "Client") {
          navigate("/dashboardClient");
        } else {
          alert("Rol no reconocido");
          navigate("/");
        }
      })
      .catch(err => {
        console.error("Error al validar token:", err);
        navigate("/");
      });
  }, [navigate]);

  return <p>Redirigiendo...</p>;
}
