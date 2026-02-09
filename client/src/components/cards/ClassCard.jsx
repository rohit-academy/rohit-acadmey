import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Lock } from "lucide-react";

function ClassCard({ id, name }) {
  const isStreamClass = id === "11" || id === "12";
  const isComingSoon = id === "ba" || id === "bsc" || id === "bcom";

  const link = isStreamClass
    ? `/streams/${id}`
    : `/subjects/${id}`;

  return (
    <Link
      to={isComingSoon ? "#" : link}   // 🚫 disable navigation if coming soon
      onClick={(e) => isComingSoon && e.preventDefault()}
      className={`relative bg-white p-6 rounded-xl shadow transition flex flex-col items-center gap-3 text-center group
        ${isComingSoon 
          ? "opacity-70 cursor-not-allowed" 
          : "hover:shadow-lg hover:-translate-y-1"}`}
    >
      {/* Icon */}
      <GraduationCap
        className={`transition group-hover:scale-110 ${
          isComingSoon ? "text-gray-400" : "text-blue-600"
        }`}
        size={30}
      />

      {/* Class Name */}
      <span
        className={`font-semibold text-lg ${
          isComingSoon ? "text-gray-500" : "text-gray-800"
        }`}
      >
        {name}
      </span>

      {/* Stream hint */}
      {isStreamClass && !isComingSoon && (
        <span className="text-xs text-blue-500">Choose Stream</span>
      )}

      {/* Coming Soon Badge */}
      {isComingSoon && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
          <Lock size={12} /> Soon
        </span>
      )}
    </Link>
  );
}

export default ClassCard;
