import '../../styles/trainers/menu.css';
import logo from '../../assets/images/logo.jpg';
import { useNavigate } from 'react-router-dom';

export default function TrainerMenu() {
  const navigate = useNavigate();

  return (
    <div className="trainer-menu">
      <div className="menu-wrapper">
        <div className="header">
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand">GYM KSG</span>
        </div>

        <h2 className="title">Select an action</h2>

        <div className="actions">
            <button onClick={() => navigate('/CreateExercise')} className="action-button">
            Create exercise
          </button>
          <button onClick={() => navigate('/DeleteExercise')} className="action-button">
            Delete exercise
          </button>
          <button onClick={() => navigate('/CreateRoutine')} className="action-button">
            Create routine
          </button>
          <button onClick={() => navigate('/EditRoutine')} className="action-button">
            Edit/Delete routine
          </button>
          <button onClick={() => navigate('/AssignRoutine')} className="action-button">
            Assign routine
          </button>
        </div>
      </div>

         <div className="bottom-navigation">
          <button className="nav-button"><i className="fas fa-home"></i></button>
          <button className="nav-button"><i className="fas fa-user-plus"></i></button>
          <button className="nav-button"><i className="fas fa-clipboard-list"></i></button>
          <button className="nav-button"><i className="fas fa-user"></i></button>
        </div>
    </div>
  );
}
