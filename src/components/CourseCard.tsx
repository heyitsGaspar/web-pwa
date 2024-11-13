import React from "react";

type Course = {
  id: number;
  nombre: string;
  precio: string;
  categoria: string;
  autor: string;
};

type CourseCardProps = {
  course: Course;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <h3 className="text-lg font-bold">{course.nombre}</h3>
      <p>Precio: {course.precio}</p>
      <p>Categoría: {course.categoria}</p>
      <p>Autor: {course.autor}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onEdit(course.id)}
          className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="bg-red-500 text-white py-1 px-3 rounded"
        >
          Borrar
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
