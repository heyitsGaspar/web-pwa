import axios from "axios";

export const getCourses = async () => {
  const response = await axios.get("https://pwa-api-production.up.railway.app/api/courses");
  return response.data;
};

// Agregar un curso
export const addCourse = async (course: { nombre: string; precio: string; categoria: string; autor: string }) => {
    try {
      const response = await axios.post("https://pwa-api-production.up.railway.app/api/courses", course);
      return response.data;
    } catch (error) {
      console.error("Error al agregar el curso:", error);
      throw error;
    }
  };
  
  // Ajustamos el tipo de id en editCourse
export const editCourse = async (id: number, updatedCourse: { nombre: string; precio: string; categoria: string; autor: string }) => {
    const response = await fetch(`https://pwa-api-production.up.railway.app/api/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCourse),
    });
  
    if (!response.ok) {
      throw new Error("Error al actualizar el curso");
    }
  
    return response.json();
  };
  
  
  // Eliminar un curso
 // Cambiamos el tipo de id en deleteCourse
export const deleteCourse = async (id: number) => {
    const response = await fetch(`https://pwa-api-production.up.railway.app/api/courses/${id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("Error al eliminar el curso");
    }
  
    return response.json();
  };
  