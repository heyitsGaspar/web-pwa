import React, { useState } from "react";
import { addCourse } from "../services/api.ts";

// Definimos el tipo Course para que sea coherente
type Course = {
  id: number;
  nombre: string;
  precio: string;
  categoria: string;
  autor: string;
};

type AddCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded: (course: Course) => void;
};

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onCourseAdded }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Tecnología");
  const [autor, setAutor] = useState("");
  
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

  const handleSubmit = async () => {
    if (precioError || autorError || !nombre || !precio || !autor) {
      return; // Si hay errores, no enviamos el formulario
    }

    try {
      const newCourse: Course = await addCourse({ nombre, precio, categoria, autor });
      onCourseAdded(newCourse);
      onClose();
    } catch (error) {
      console.error("Error al agregar el curso:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agregar Curso</h2>
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
          onChange={handlePrecioChange}  // Usamos la validación de precio
          className="border p-2 w-full mb-2"
        />
        {precioError && <p className="text-red-500 text-sm">{precioError}</p>} {/* Mensaje de error */}
        
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
          onChange={handleAutorChange}  // Usamos la validación de autor
          className="border p-2 w-full mb-2"
        />
        {autorError && <p className="text-red-500 text-sm">{autorError}</p>} {/* Mensaje de error */}
        
        <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
          Agregar
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AddCourseModal;
