  import { useNavigate } from 'react-router-dom';
  import '../../styles/profile/userProfile.css';
  
  // 🔥 Usuario quemado (cliente o trainer)
  const mockUser = {
    username: "susanita",
    photo: "https://link.com/profile.jpg",
    role: "Trainer",
    phone: "61096505",
    gender: "female"
  };
  
  export default function UserProfile() {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("session_token");
      navigate("/login");
    };
  
    return (
      <div className="profile-container">
        <h2>GYM KSG</h2>
  
        <div className="profile-card">
          <img
            src={mockUser.photo}
            alt="Profile"
            className="profile-photo"
          />
          <h3>{mockUser.username}</h3>
          <hr className="divider" />
          <p className="role">{mockUser.role}</p>
          <p><strong>Phone</strong>: {mockUser.phone}</p>
          <p><strong>Gender</strong>: {mockUser.gender}</p>
        </div>
  
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    );
  }
