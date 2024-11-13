import React, { useEffect, useState } from "react";
import { getCourses } from "../services/api.ts";
import CourseCard from "../components/CourseCard.tsx";
import { io } from "socket.io-client";

const socket = io("https://tu-api.com");

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCourses();
      setCourses(data);
    };
    fetchData();

    socket.on("cursoActualizado", (newCourse) => {
      setCourses((prevCourses) => [...prevCourses, newCourse]);
    });

    return () => {
      socket.off("cursoActualizado");
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cursos Disponibles</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
