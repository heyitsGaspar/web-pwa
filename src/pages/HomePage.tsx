import React, { useEffect, useState } from "react";
import { getCourses, deleteCourse } from "../services/api.ts";
import CourseCard from "../components/CourseCard.tsx";
import AddCourseModal from "../components/AddCourseModal.tsx";
import EditCourseModal from "../components/EditCourseModal.tsx";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.tsx";

type Course = {
  id: number;
  nombre: string;
  precio: string;
  categoria: string;
  autor: string;
};

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const data = await getCourses();
    setCourses(data);
  };

  const handleCourseAdded = (course: Course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleCourseEdited = (updatedCourse: Course) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
    );
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (selectedCourse) {
      await deleteCourse(selectedCourse.id);
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== selectedCourse.id));
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cursos Disponibles</h1>
      <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded my-4">
        Agregar Curso
      </button>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCourseAdded={handleCourseAdded}
      />

      {selectedCourse && (
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          course={selectedCourse}
          onCourseEdited={handleCourseEdited}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={confirmDeleteCourse}
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => handleEditCourse(course)}
            onDelete={() => handleDeleteCourse(course)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
