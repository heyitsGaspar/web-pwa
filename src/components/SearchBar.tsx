// src/components/SearchBar.tsx
import React from "react";

type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Buscar cursos..."
      value={searchTerm}
      onChange={onSearchChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>
);

export default SearchBar;
