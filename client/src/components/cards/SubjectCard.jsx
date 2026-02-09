import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";

function SubjectCard({ subject, streamId }) {
  const subjectSlug = subject.toLowerCase().replace(/\s+/g, "-");

  // 🎨 Stream-based theme
  const streamTheme = {
    pcb: {
      icon: "text-green-600",
      border: "hover:border-green-500",
      bg: "hover:bg-green-50"
    },
    pcm: {
      icon: "text-blue-600",
      border: "hover:border-blue-500",
      bg: "hover:bg-blue-50"
    },
    arts: {
      icon: "text-pink-600",
      border: "hover:border-pink-500",
      bg: "hover:bg-pink-50"
    }
  };

  const theme = streamTheme[streamId] || {
    icon: "text-blue-600",
    border: "hover:border-blue-400",
    bg: "hover:bg-blue-50"
  };

  return (
    <Link
      to={`/materials/${subjectSlug}`}
      className={`group bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center gap-3 text-center border-t-4 border-transparent ${theme.border} ${theme.bg}`}
    >
      <BookOpen className={`${theme.icon} group-hover:scale-110 transition`} size={28} />

      <span className="font-semibold">{subject}</span>

      {/* Small tag */}
      <span className="text-xs text-gray-500 flex items-center gap-1">
        <Sparkles size={12} /> Study Materials
      </span>
    </Link>
  );
}

export default SubjectCard;
