import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/register.css';
import { usersApi } from '../../services/usersService';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Client' | 'Trainer'>('Client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      alert('Selecciona una foto de perfil');
      return;
    }

    /* Construye el FormData con las claves que espera el backend y el modulo de seguridad 
    const form = new FormData();
    form.append('name', name);
    form.append('username', username);
    form.append('gender', gender.toLowerCase());
    form.append('phone', phone);
    form.append('role', role);
    form.append('email', email);
    form.append('password', password);
    form.append('photo', photoFile); // <- clave del archivo (ajústala si tu backend usa 'file'/'avatar')

    try {
      const result = await createUser(form);
      console.log('[DEBUG] FastAPI:', result);
      alert('¡Usuario registrado correctamente!');
      navigate('/login');
    } catch (err) {
      console.error('[ERROR]', err);
      alert('Error al registrar usuario.');
    }
  };

  */

  const fd = new FormData();
    fd.append('username', username);
    fd.append('gender', gender.toLowerCase() as 'male' | 'female');
    if (phone) fd.append('phone', phone);
    if (photoFile) fd.append('photo', photoFile);

    try {
      const user = await usersApi.create(fd);
      console.log('Creado:', user);
      alert('¡Usuario creado!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error creando usuario');
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
          placeholder="Username (this must be unique)"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <select
          className="register-input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
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
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="register-input"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setPhotoFile(f);
          }}
          required
        />

        <select
          className="register-input"
          value={role}
          onChange={(e) => setRole(e.target.value as 'Client' | 'Trainer')}
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

        <button type="submit" className="register-button">Register</button>

        <button
          className="back-button"
          type="button"
          onClick={() => navigate('/')}
        >
          Go back to Login
        </button>
      </form>
    </div>
  );
}
