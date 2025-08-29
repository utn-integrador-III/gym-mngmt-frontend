import '../../styles/trainers/menu.css';
import logo from '../../assets/images/logo.jpg';
import { useNavigate } from 'react-router-dom';

function IconDumbbell() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M3 9h2v6H3V9zm16 0h2v6h-2V9zM7 7h2v10H7V7zm8 0h2v10h-2V7zM10 11h4v2h-4v-2z"/>
    </svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M6 7h12v2H6V7zm2 3h2v8H8v-8zm6 0h2v8h-2v-8zM9 4h6l1 2H8l1-2zM5 9h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 9z"/>
    </svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5z"/>
    </svg>
  );
}
function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M9 2h6v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2zm0 4H6v14h12V6h-3v2H9V6z"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M16 11c1.66 0 2.99-1.57 2.99-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 2.99-1.57 2.99-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11zm0 2c-2.33 0-7 1.17-7 3.5V20h10v-3.5C11 14.17 6.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  );
}

type TileProps = { label: string; onClick: () => void; Icon: React.FC; hint?: string; };
function ActionTile({ label, onClick, Icon, hint }: TileProps) {
  return (
    <button className="tile" onClick={onClick}>
      <div className="tile-inner">
        <div className="tile-icon"><Icon /></div>
        <div className="tile-label">{label}</div>
        {hint && <div className="tile-hint">{hint}</div>}
      </div>
    </button>
  );
}

export default function TrainerMenu() {
  const navigate = useNavigate();
  const ROUTES = {
    home: '/TrainerMenu',
    createExercise: '/CreateExercise',
    deleteExercise: '/DeleteExercise',
    createRoutine: '/CreateRoutine',
    editRoutine: '/EditRoutine',
    assignRoutine: '/AssignRoutine',
    clientList: '/ClientList',
  };

  return (
    <div className="trainer-menu">
      <div className="bg-blobs" aria-hidden="true" />
      <div className="menu-card">
        <header className="menu-head">
          <div className="logo-wrap">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <span className="brand">GYM KSG</span>
        </header>

        <h2 className="menu-title">
          <span>Select an action</span>
          <i className="underline" aria-hidden="true" />
        </h2>

        <div className="tiles-grid">
          <ActionTile label="Create exercise" onClick={() => navigate(ROUTES.createExercise)} Icon={IconDumbbell} hint="Add a new movement" />
          <ActionTile label="Delete exercise" onClick={() => navigate(ROUTES.deleteExercise)} Icon={IconTrash} hint="Remove an exercise" />
          <ActionTile label="Create routine" onClick={() => navigate(ROUTES.createRoutine)} Icon={IconPlus} hint="Build daily plan" />
          <ActionTile label="Edit/Delete routine" onClick={() => navigate(ROUTES.editRoutine)} Icon={IconEdit} hint="Modify or remove" />
          <ActionTile label="Assign routine" onClick={() => navigate(ROUTES.assignRoutine)} Icon={IconClipboard} hint="Link to clients" />
          <ActionTile label="Client list" onClick={() => navigate(ROUTES.clientList)} Icon={IconUsers} hint="Profiles & progress" />
        </div>
      </div>

      <nav className="bottom-navigation" aria-label="Quick actions">
        <button className="nav-button" title="Home" onClick={() => navigate(ROUTES.home)}><i className="fas fa-home" /></button>
        <button className="nav-button" title="Create exercise" onClick={() => navigate(ROUTES.assignRoutine)}><i className="fas fa-user-plus" /></button>
        <button className="nav-button" title="Assign routine" onClick={() => navigate(ROUTES.clientList)}><i className="fas fa-clipboard-list" /></button>
        </nav>
    </div>
  );
}
