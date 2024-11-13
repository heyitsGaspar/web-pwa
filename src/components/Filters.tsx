// src/components/Filters.tsx
import React from "react";

type FiltersProps = {
  category: string;
  priceOrder: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriceOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Filters: React.FC<FiltersProps> = ({ category, priceOrder, onCategoryChange, onPriceOrderChange }) => {
  return (
    <div className="flex gap-4 mb-6">
      {/* Filtro por Categoría */}
      <div>
        <label htmlFor="category" className="block font-medium">Categoría</label>
        <select
          id="category"
          value={category}
          onChange={onCategoryChange}
          className="p-2 border rounded"
        >
          <option value="">Todas</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Inglés">Inglés</option>
          <option value="Matemáticas">Matemáticas</option>
        </select>
      </div>

      {/* Filtro por Orden de Precio */}
      <div>
        <label htmlFor="priceOrder" className="block font-medium">Ordenar por Precio</label>
        <select
          id="priceOrder"
          value={priceOrder}
          onChange={onPriceOrderChange}
          className="p-2 border rounded"
        >
          <option value="asc">De Menor a Mayor</option>
          <option value="desc">De Mayor a Menor</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
