import axios from "axios";
import { Course } from "../models/types.ts";

const API_URL = "https://pwa-api-production-f5fc.up.railway.app/api/courses";
// Método para obtener los cursos, intentando desde la API y luego el caché si falla
export const getCourses = async (): Promise<Course[]> => {
  try {
    // Intenta obtener los cursos desde la API
    const response = await axios.get(API_URL);
    const courses: Course[] = response.data;
    return courses;
  } catch (error) {
    console.error("Error al obtener los cursos desde la API, cargando desde el caché:", error);

    // Intentar cargar desde el caché en caso de error (offline)
    if ('caches' in window) {
      const cache = await caches.open('courses-cache-v1');
      const cachedResponse = await cache.match(API_URL);
      if (cachedResponse) {
        return cachedResponse.json();
      }
    }

    throw new Error("No hay datos en caché y no se pudo acceder a la API.");
  }
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
  