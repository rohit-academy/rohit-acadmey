import React from "react";

function SubjectsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
        >

          <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4"></div>

          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

          <div className="h-3 bg-gray-100 rounded w-1/2"></div>

        </div>
      ))}

    </div>
  );
}

export default SubjectsSkeleton;