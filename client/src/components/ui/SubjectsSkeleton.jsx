import React from "react";

function SubjectsSkeleton() {

  return (

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

      {Array.from({ length: 10 }).map((_, i) => (

        <div
          key={i}
          className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >

          {/* Shimmer Animation Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>

          {/* Icon Skeleton */}
          <div className="w-12 h-12 rounded-xl bg-gray-200 mb-4"></div>

          {/* Title Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

          {/* Subtitle Skeleton */}
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>

        </div>

      ))}

      {/* Custom Animation */}
      <style>
        {`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        `}
      </style>

    </div>

  );

}

export default SubjectsSkeleton;