const API_URL = "http://localhost:8000/exercises";

export const createExercise = async (name: string, difficulty: string) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, difficulty }),
    });

    if (!res.ok) throw new Error("No se pudo crear el ejercicio");
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido al crear el ejercicio" };
  }
};

export const getExercises = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("No se pudo obtener los ejercicios");
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido al obtener ejercicios" };
  }
};

export const updateExercise = async (id: string, name: string, difficulty: string) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, difficulty }),
    });

    if (!res.ok) throw new Error("No se pudo actualizar el ejercicio");
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido al actualizar" };
  }
};

export const deleteExercise = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("No se pudo eliminar el ejercicio");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido al eliminar" };
  }
};
