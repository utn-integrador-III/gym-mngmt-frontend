import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [role, setRole] = useState('Client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const securityData = {
      name: name,
      phone: phone,
      role: role,
      email: email,
      password: password
    };


    const profileData = {
      gender: gender,
      phone: phone,
      photo: photo,
      username: username
    };


    try {
      // 🚧 Registro en el módulo de seguridad (espacio reservado)
      console.log('[DEBUG] Seguridad > Datos prueba:', securityData);
      // await fetch('http://MODULO_SEGURIDAD/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(securityData)
      // });

      // ✅ Registro local en FastAPI
      alert(JSON.stringify(profileData));

      const localResponse = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

     if (localResponse.ok) {
      const result = await localResponse.json();
      console.log('[DEBUG] Respuesta de FastAPI:', result);
      alert('¡Usuario registrado correctamente!');
      navigate('/');
    } else {
      const errorText = await localResponse.text();
      console.error('[ERROR] Respuesta de FastAPI:', errorText);
      alert('Error al registrar usuario en FastAPI.');
    }

    } catch (err) {
      console.error('[ERROR]', err);
      alert('Error en el proceso de registro.');
    }
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

        <input
          type="text"
          placeholder="Username"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <select
          className="register-input"
          value={gender}
          onChange={(e) => setGender(e.target.value.toLowerCase())}
          required
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <input
          type="tel"
          placeholder="Phone"
          className="register-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="Photo URL"
          className="register-input"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
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
        type="button">
        Go back to Login
      </button>
    </div>
  );
}
