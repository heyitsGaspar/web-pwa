import React, { useState, useEffect } from "react";
import { editCourse } from "../services/api.ts";

type Course = {
  id: number;
  nombre: string;
  precio: string;
  categoria: string;
  autor: string;
};

type EditCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onCourseEdited: (updatedCourse: Course) => void;
};

const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, course, onCourseEdited }) => {
  const [nombre, setNombre] = useState(course.nombre);
  const [precio, setPrecio] = useState(course.precio);
  const [categoria, setCategoria] = useState(course.categoria);
  const [autor, setAutor] = useState(course.autor);

  const [precioError, setPrecioError] = useState("");
  const [autorError, setAutorError] = useState("");

  // Validación de precio (solo números)
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/; // Permite solo números y decimales

    if (regex.test(value)) {
      setPrecio(value);
      setPrecioError("");
    } else {
      setPrecioError("El precio debe ser un número válido.");
    }
  };

  // Validación de autor (solo letras)
  const handleAutorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]*$/; // Permite solo letras y espacios

    if (regex.test(value)) {
      setAutor(value);
      setAutorError("");
    } else {
      setAutorError("El autor solo puede contener letras.");
    }
  };


  useEffect(() => {
    if (isOpen) {
      setNombre(course.nombre);
      setPrecio(course.precio);
      setCategoria(course.categoria);
      setAutor(course.autor);
    }
  }, [isOpen, course]);

  const handleSubmit = async () => {
    if (precioError || autorError || !nombre || !precio || !autor) {
        return; // Si hay errores, no enviamos el formulario
      }
  
    try {
      const updatedCourse = await editCourse(course.id, { nombre, precio, categoria, autor });
      onCourseEdited(updatedCourse);
      onClose();
    } catch (error) {
      console.error("Error al editar el curso:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Curso</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Precio"
          value={precio}
          onChange={handlePrecioChange}
          className="border p-2 w-full mb-2"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="Tecnología">Tecnología</option>
          <option value="Inglés">Inglés</option>
          <option value="Matemáticas">Matemáticas</option>
        </select>
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={handleAutorChange}
          className="border p-2 w-full mb-4"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
          Guardar
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditCourseModal;
