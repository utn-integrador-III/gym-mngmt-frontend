import { useEffect, useState } from 'react';
import '../../styles/trainers/clientList.css';

interface Client {
  _id: string;
  username: string;
  photo?: string;
  role?: string;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then(res => res.json())
      .then(data => {
        // cuando pueda validar el token, filtrar por rol
        const filtered = data.filter((user: Client) => user.role === "Client" || !user.role);
        setClients(filtered);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      });
  }, []);

  return (
    <div className="client-list-container">
      <h2>List of Clients</h2>
      <div className="client-list">
        {clients.map((client) => (
          <div key={client._id} className="client-card">
            <img
              src={client.photo || 'https://via.placeholder.com/60'}
              alt="profile"
              className="client-photo"
            />
            <span className="client-name">{client.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
