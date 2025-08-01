import { useEffect, useState } from "react";
import "../../styles/trainers/assignRoutine.css";

interface Client {
  _id: string;
  username: string;
}

interface Routine {
  _id: string;
  name: string;
}

export default function AssignRoutine() {
  const [clients, setClients] = useState<Client[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedRoutineId, setSelectedRoutineId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("lunes");

  // get clients
  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((u: any) => u.role === "Client" || !u.role);
        setClients(filtered);
      })
      .catch((err) => console.error("Error cargando clientes:", err));
  }, []);

  // get routines 
  useEffect(() => {
    fetch("http://localhost:8000/dailyroutines")
      .then((res) => res.json())
      .then((data) => setRoutines(data))
      .catch((err) => console.error("Error cargando rutinas:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId || !selectedRoutineId || !dayOfWeek) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const routineData = {
      id_coach: "687e06685d26f6a1fe30c0a5", // EN LO QUE ACOMODAMOS CON EL MÓDULO DE SEGURIDAD
      id_client: selectedClientId,
      id_dailyroutineexercise: selectedRoutineId,
      notes: "",
      done: false,
      dayofweek: dayOfWeek
    };

    try {
      const res = await fetch("http://localhost:8000/assignedroutines/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routineData)
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Rutina asignada correctamente.");
        // Reset form fields
        setSelectedClientId("");
        setSelectedRoutineId("");
        setDayOfWeek("lunes");
      } else {
        alert(result.detail || "Error al asignar rutina.");
      }
    } catch (err) {
      console.error("[ERROR]", err);
      alert("Error en la asignación de rutina.");
    }
  };

  return (
    <div className="assign-container">
      <h2>Asignar rutina a cliente</h2>
      <form className="assign-form" onSubmit={handleSubmit}>
        <label>Cliente:</label>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          required
        >
          <option value="">Seleccione un cliente</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.username}
            </option>
          ))}
        </select>

        <label>Rutina:</label>
        <select
          value={selectedRoutineId}
          onChange={(e) => setSelectedRoutineId(e.target.value)}
          required
        >
          <option value="">Seleccione una rutina</option>
          {routines.map((routine) => (
            <option key={routine._id} value={routine._id}>
              {routine.name}
            </option>
          ))}
        </select>

        <label>Día de la semana:</label>
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          required
        >
          <option value="lunes">Lunes</option>
          <option value="martes">Martes</option>
          <option value="miércoles">Miércoles</option>
          <option value="jueves">Jueves</option>
          <option value="viernes">Viernes</option>
        </select>

        <button type="submit">Asignar rutina</button>
      </form>
    </div>
  );
}
