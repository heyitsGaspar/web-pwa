import axios from "axios";
import { Course } from "../models/types.ts";
import Push from "push.js";

// const API_URL = 'https://pwa-api-production-courses.up.railway.app/api/courses';
 const API_URL = 'http://localhost:3000/api/courses';
// const API_URL =
//   window.location.origin.includes("localhost")
//     ? "http://localhost:3000/api/courses"
//     : "https://pwa-api-production-courses.up.railway.app/api/courses";
// Método para obtener los cursos, intentando desde la API y luego el caché si falla

export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(API_URL);
    const courses: Course[] = response.data;

    // Actualiza el caché con los datos más recientes
    if ("caches" in window) {
      const cache = await caches.open("courses-cache-v4");
      cache.put(API_URL, new Response(JSON.stringify(courses)));
    }

    return courses;
  } catch (error) {
    console.error("Error al obtener los cursos, intentando cargar desde el caché:", error);

    if ("caches" in window) {
      const cache = await caches.open("courses-cache-v4");
      const cachedResponse = await cache.match(API_URL);
      if (cachedResponse) {
        return cachedResponse.json();
      }
    }

    throw new Error("No hay datos disponibles en caché ni en la API.");
  }
};


// export const getCourses = async (): Promise<Course[]> => {
//   try {
//     // Eliminar el caché antes de hacer la solicitud para obtener la versión más reciente
//     if ('caches' in window) {
//       const cache = await caches.open('courses-cache-v5');
//       await cache.delete(API_URL); // Elimina el caché de la API
//     }

//     // Intenta obtener los cursos desde la API
//     const response = await axios.get(API_URL);
//     const courses: Course[] = response.data;

//     // Después de obtener los cursos, los guardamos en el caché para futuras solicitudes
//     if ('caches' in window) {
//       const cache = await caches.open('courses-cache-v5');
//       cache.put(API_URL, new Response(JSON.stringify(courses)));
//     }

//     return courses;
//   } catch (error) {
//     console.error("Error al obtener los cursos desde la API, cargando desde el caché:", error);

//     // Intentar cargar desde el caché en caso de error (offline)
//     if ('caches' in window) {
//       const cache = await caches.open('courses-cache-v5');
//       const cachedResponse = await cache.match(API_URL);
//       if (cachedResponse) {
//         return cachedResponse.json();
//       }
//     }

//     throw new Error("No hay datos en caché y no se pudo acceder a la API.");
//   }
// };



// Agregar un curso
export const addCourse = async (course: { nombre: string; precio: string; categoria: string; autor: string }) => {
  try {
    const response = await axios.post(API_URL, course);
    const newCourse = response.data;

    // Actualizar el caché con el nuevo curso
    if ("caches" in window) {
      const cache = await caches.open("courses-cache-v5");
      const cachedResponse = await cache.match(API_URL);
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        cachedData.push(newCourse); // Añadir el nuevo curso al caché
        cache.put(API_URL, new Response(JSON.stringify(cachedData)));
      }
    }

    // Mostrar la notificación
    Push.create("Curso creado", {
      body: `El curso "${newCourse.nombre}" se ha creado correctamente.`,
      icon: "/path-to-icon.png", // Cambia por la ruta de tu icono si lo necesitas
      timeout: 5000, // Duración de la notificación
      onClick: function () {
        window.focus(); // Llevar al usuario a la app al hacer clic
        this.close(); // Cierra la notificación
      },
    });

    return newCourse;
  } catch (error) {
    console.error("Error al agregar el curso:", error);
    Push.create("Error al agregar curso", {
      body: "No se pudo agregar el curso. Verifica tu conexión.",
      timeout: 5000,
    });
    throw error;
  }
};
// export const addCourse = async (course: { nombre: string; precio: string; categoria: string; autor: string }) => {
//   try {
//     const response = await axios.post(API_URL, course);
//     const newCourse = response.data;

//     // Actualizar el caché con el nuevo curso
//     if ('caches' in window) {
//       const cache = await caches.open('courses-cache-v5');
//       const cachedResponse = await cache.match(API_URL);
//       if (cachedResponse) {
//         const cachedData = await cachedResponse.json();
//         cachedData.push(newCourse); // Añadir el nuevo curso al caché
//         cache.put(API_URL, new Response(JSON.stringify(cachedData)));
//       }
//     }

//     return newCourse;
//   } catch (error) {
//     console.error("Error al agregar el curso:", error);
//     alert("Error conéctate a internet e intentalo de nuevo");
//     throw error;
//   }
// };

// Editar un curso
export const editCourse = async (id: number, updatedCourse: { nombre: string; precio: string; categoria: string; autor: string }) => {
  const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCourse),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el curso");
  }

  // Actualizar el caché con el curso actualizado
  if ('caches' in window) {
    const cache = await caches.open('courses-cache-v5');
    const cachedResponse = await cache.match(API_URL);
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      const index = cachedData.findIndex((course: { id: number }) => course.id === id);
      if (index !== -1) {
        cachedData[index] = { ...cachedData[index], ...updatedCourse };
        cache.put(API_URL, new Response(JSON.stringify(cachedData)));
      }
    }
  }

  return response.json();
};

// Eliminar un curso
export const deleteCourse = async (id: number) => {
  const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el curso");
  }

  // Actualizar el caché después de eliminar el curso
  if ('caches' in window) {
    const cache = await caches.open('courses-cache-v5');
    const cachedResponse = await cache.match(API_URL);
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      const filteredData = cachedData.filter((course: { id: number }) => course.id !== id);
      cache.put(API_URL, new Response(JSON.stringify(filteredData)));
    }
  }

  return response.json();
};
