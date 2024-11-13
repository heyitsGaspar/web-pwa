import React from "react";

type CourseProps = {
  nombre: string;
  precio: string;
  categoria: string;
  autor: string;
};

const CourseCard: React.FC<CourseProps> = ({ nombre, precio, categoria, autor }) => (
  <div className="p-4 border rounded-md shadow-md">
    <h3 className="text-xl font-bold">{nombre}</h3>
    <p className="text-gray-700">Categoría: {categoria}</p>
    <p className="text-gray-500">Autor: {autor}</p>
    <p className="text-green-600 font-semibold">Precio: {precio}</p>
  </div>
);

export default CourseCard;
