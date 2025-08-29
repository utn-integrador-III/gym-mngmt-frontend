import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/profile/userProfile.css';

interface User {
  username: string;
  photo: string;
  role: 'Client' | 'Trainer';
  phone: string;
  gender: 'male' | 'female';
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar sesión
    const sessionToken = localStorage.getItem("session_token");
    const userData = localStorage.getItem("user_data");

    if (!sessionToken || !userData) {
      alert("No hay sesión activa. Inicia sesión.");
      navigate("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userData);

      // Validaciones básicas de datos
      if (
        !parsedUser.username ||
        !parsedUser.photo ||
        !parsedUser.role ||
        !parsedUser.phone ||
        !parsedUser.gender
      ) {
        throw new Error("Datos de usuario incompletos");
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      alert("Hubo un problema con los datos del perfil. Inicia sesión de nuevo.");
      localStorage.removeItem("session_token");
      localStorage.removeItem("user_data");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  if (!user) {
    return <p className="loading-text">Cargando perfil...</p>;
  }

  return (
    <div className="profile-container">
      <h2>GYM KSG</h2>

      <div className="profile-card">
        <img
          src={user.photo}
          alt="Profile"
          className="profile-photo"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/150?text=No+Photo";
          }}
        />
        <h3>{user.username}</h3>
        <hr className="divider" />
        <p className="role">{user.role}</p>
        <p><strong>Phone</strong>: {user.phone}</p>
        <p><strong>Gender</strong>: {user.gender}</p>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}
