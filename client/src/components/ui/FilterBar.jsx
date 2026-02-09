import React from "react";

function FilterBar({ filters, activeFilter, setActiveFilter }) {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-1 scrollbar-hide">

      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
              ${isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"}
            `}
          >
            {filter}
          </button>
        );
      })}

    </div>
  );
}

export default FilterBar;
