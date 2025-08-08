const API_URL = "http://localhost:8000/daily_routinesApi";

export const updateRoutine = async (
  id: string,
  id_coach: string,
  id_exercise: string,
  name: string
) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_coach,
        id_exercise,
        name
      }),
    });

    if (!res.ok) throw new Error("No se pudo actualizar la rutina");
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido al actualizar la rutina" };
  }
};
