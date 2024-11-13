import React from "react";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirmDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este curso?</p>
        <div className="flex justify-end mt-4">
          <button onClick={onConfirmDelete} className="bg-red-500 text-white py-2 px-4 rounded mr-2">
            Sí, eliminar
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
