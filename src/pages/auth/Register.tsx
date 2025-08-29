import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/register.css';
import { usersApi } from '../../services/usersService';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
    else if (name.length < 3) newErrors.name = 'El nombre debe tener al menos 3 caracteres.';

    if (!username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';
    else if (username.includes(' ')) newErrors.username = 'El nombre de usuario no puede tener espacios.';
    else if (username.length < 3) newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres.';

    if (!gender) newErrors.gender = 'Selecciona un género.';

    if (!phone.trim()) newErrors.phone = 'El número de teléfono es obligatorio.';
    else if (!/^\d{8,}$/.test(phone)) newErrors.phone = 'El teléfono debe contener al menos 8 dígitos.';

    if (!email.trim()) newErrors.email = 'El correo electrónico es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'El correo electrónico no es válido.';

    if (!password.trim()) newErrors.password = 'La contraseña es obligatoria.';
    else if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';

    if (!photoFile) newErrors.photo = 'La foto de perfil es obligatoria.';
    else if (!['image/png', 'image/jpeg', 'image/webp'].includes(photoFile.type))
      newErrors.photo = 'Formato de imagen no válido. Usa PNG, JPEG o WEBP.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('gender', gender.toLowerCase());
    formData.append('phone', phone);
    formData.append('role', role);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('photo', photoFile!);

    try {
      const createdUser = await usersApi.create(formData);
      console.log('Usuario creado:', createdUser);
      alert('¡Usuario creado con éxito!');
      navigate('/');
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('Ocurrió un error al crear el usuario. Ver consola para más detalles.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Welcome to the gym!</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className={`register-input ${errors.name ? 'input-error' : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        {/* Username */}
        <input
          type="text"
          placeholder="Username (unique)"
          className={`register-input ${errors.username ? 'input-error' : ''}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}

        {/* Gender */}
        <select
          className={`register-input ${errors.gender ? 'input-error' : ''}`}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        {errors.gender && <p className="error-text">{errors.gender}</p>}

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone"
          className={`register-input ${errors.phone ? 'input-error' : ''}`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        {/* Photo */}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className={`register-input ${errors.photo ? 'input-error' : ''}`}
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
        />
        {errors.photo && <p className="error-text">{errors.photo}</p>}


        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className={`register-input ${errors.email ? 'input-error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className={`register-input ${errors.password ? 'input-error' : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* Submit */}
        <button type="submit" className="register-button">
          Register
        </button>
        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/')}
        >
          Go back to Login
        </button>
      </form>
    </div>
  );
}
