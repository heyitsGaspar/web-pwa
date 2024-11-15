import React, { useEffect, useState, useCallback } from "react";
import { getCourses, deleteCourse } from "../services/api.ts";
import CourseCard from "../components/CourseCard.tsx";
import AddCourseModal from "../components/AddCourseModal.tsx";
import EditCourseModal from "../components/EditCourseModal.tsx";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.tsx";
import Filters from "../components/Filters.tsx";
import SearchBar from "../components/SearchBar.tsx";

type Course = {
  id: number;
  nombre: string;
  precio: string;
  categoria: string;
  autor: string;
};

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priceOrder, setPriceOrder] = useState<string>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const coursesPerPage = 6;

  const paginateCourses = useCallback(() => {
    const filteredCourses = courses
      .filter((course) => {
        const categoryMatch = categoryFilter ? course.categoria === categoryFilter : true;
        const searchMatch = course.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        if (priceOrder === "asc") {
          return parseFloat(a.precio) - parseFloat(b.precio);
        } else {
          return parseFloat(b.precio) - parseFloat(a.precio);
        }
      })
      .slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);
    
    setDisplayedCourses(filteredCourses);
  }, [courses, currentPage, categoryFilter, priceOrder, searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    paginateCourses();
  }, [paginateCourses]);

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

  const handleNextPage = () => {
    if (currentPage * coursesPerPage < courses.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cursos Disponibles</h1>
      
      <SearchBar searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />

      <Filters
        category={categoryFilter}
        priceOrder={priceOrder}
        onCategoryChange={(e) => setCategoryFilter(e.target.value)}
        onPriceOrderChange={(e) => setPriceOrder(e.target.value)}
      />

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
        {displayedCourses.length > 0 ? (
          displayedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => handleEditCourse(course)}
              onDelete={() => handleDeleteCourse(course)}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center my-20">
            <p className="text-center text-gray-500">No se encontraron cursos que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </div>


      <div className="pagination flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-400"
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-lg">
          Página {currentPage} de {Math.ceil(courses.length / coursesPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage * coursesPerPage >= courses.length}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default HomePage;
