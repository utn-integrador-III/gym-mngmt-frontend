import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, role, email, password });
    // Here will be the logic to handle registration, API call
  };

  return (
    <div className="register-container">
      <h2 className="register-title">New User</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="register-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="register-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Client">Client</option>
          <option value="Trainer">Trainer</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="register-button">
          Register
        </button>
      </form>

      <button
        className="back-button"
        type="button"
        onClick={() => navigate('/')}
      >
        Go back to Login
      </button>
    </div>
  );
}
