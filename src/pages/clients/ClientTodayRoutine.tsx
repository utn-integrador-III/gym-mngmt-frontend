import { useEffect, useState } from 'react';
import '../../styles/clients/todayRoutine.css';

interface AssignedRoutine {
  _id: string;
  id_dailyroutineexercise: string;
  id_client: string;
  id_coach: string;
  notes: string;
  done: boolean;
  dayofweek: string;
}

interface Routine {
  _id: string;
  name: string;
}

const clientId = "687f715c6811be42dffd67b8"; // Esperando acomodarlo con el módulo de seguridad

export default function ClientTodayRoutine() {
  const [day, setDay] = useState("lunes");
  const [assignedRoutines, setAssignedRoutines] = useState<AssignedRoutine[]>([]);
  const [routinesMap, setRoutinesMap] = useState<{ [key: string]: string }>({});
  const [noteInput, setNoteInput] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState<AssignedRoutine | null>(null);

  // Días disponibles
  const days = ["lunes", "martes", "miércoles", "jueves", "viernes"];

  useEffect(() => {
    fetch("http://localhost:8000/assignedroutines")
      .then(res => res.json())
      .then(data => {
        const clientRoutines = data.filter((r: AssignedRoutine) => r.id_client === clientId);
        setAssignedRoutines(clientRoutines);
      });
    
    fetch("http://localhost:8000/dailyroutines")
      .then(res => res.json())
      .then(data => {
        const map: { [key: string]: string } = {};
        data.forEach((r: Routine) => {
          map[r._id] = r.name;
        });
        setRoutinesMap(map);
      });
  }, []);

  useEffect(() => {
    const match = assignedRoutines.find(r => r.dayofweek === day);
    setSelectedRoutine(match || null);
    setNoteInput(match?.notes || "");
  }, [day, assignedRoutines]);

  const handleToggleDone = async () => {
    if (!selectedRoutine) return;
    const updated = { ...selectedRoutine, done: !selectedRoutine.done };

    const res = await fetch(`http://localhost:8000/assignedroutines/${selectedRoutine._id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: updated.done })
    });

    if (res.ok) {
      setAssignedRoutines(prev =>
        prev.map(r => r._id === updated._id ? { ...r, done: updated.done } : r)
      );
    }
  };

  const handleSaveNote = async () => {
    if (!selectedRoutine) return;

    const res = await fetch(`http://localhost:8000/assignedroutines/${selectedRoutine._id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: noteInput })
    });

    if (res.ok) {
      alert("Nota guardada correctamente.");
    } else {
      alert("Error al guardar la nota.");
    }
  };

  const progress = Math.round(
    (assignedRoutines.filter(r => r.done).length / Math.max(1, assignedRoutines.length)) * 100
  );

  return (
    <div className="routine-container">
      <h2>GYM KSG</h2>

      <div className="day-tabs">
        {days.map(d => (
          <button
            key={d}
            className={d === day ? "active-day" : ""}
            onClick={() => setDay(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div className="routine-box">
        <h3>My routine today</h3>
        <p>{selectedRoutine ? routinesMap[selectedRoutine.id_dailyroutineexercise] : "No routine assigned"}</p>
      </div>

      <div className="progress-box">
        <h3>My progress</h3>
        <div className="progress-bar">
          <div className="fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}%</p>
      </div>

      {selectedRoutine && (
        <>
          <div className="toggle-box">
            <label>Done!</label>
            <input
              type="checkbox"
              checked={selectedRoutine.done}
              onChange={handleToggleDone}
            />
          </div>

          <div className="notes-box">
            <h4>Notes</h4>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              rows={4}
            />
            <button onClick={handleSaveNote}>Save Note</button>
          </div>
        </>
      )}
    </div>
  );
}
