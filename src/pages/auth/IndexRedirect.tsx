import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../core/config";

export default function IndexRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/auth/me`, { credentials: "include" });
        if (!res.ok) { navigate("/"); return; }
        const data = await res.json();
        if (data.role === "Trainer") navigate("/trainerMenu");
        else if (data.role === "Client") navigate("/clientTodayRoutine");
        else navigate("/");
      } catch (err) {
        console.error("Error al validar token:", err);
        navigate("/");
      }
    })();
  }, [navigate]);

  return <p>Redirigiendo...</p>;
}
