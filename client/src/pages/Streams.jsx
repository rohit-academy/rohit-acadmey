import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Atom, Calculator, Palette, ArrowLeft } from "lucide-react";

function Streams() {

  const { classId } = useParams();

  /* =====================================
     🔐 VALIDATION
  ===================================== */
  const normalizedClass = String(classId || "").trim();

  const validClasses = ["11", "12"];

  if (!normalizedClass || !validClasses.includes(normalizedClass)) {
    console.warn("❌ Invalid classId:", classId);
    return <Navigate to="/classes" replace />;
  }

  /* =====================================
     📚 STREAM CONFIG (SCALABLE)
  ===================================== */
  const streams = [
    {
      id: "pcb",
      name: "PCB (Biology Group)",
      desc: "Physics • Chemistry • Biology",
      icon: Atom,
      color: "green"
    },
    {
      id: "pcm",
      name: "PCM (Maths Group)",
      desc: "Physics • Chemistry • Mathematics",
      icon: Calculator,
      color: "blue"
    },
    {
      id: "arts",
      name: "Arts Stream",
      desc: "History • Geography • Political Science & more",
      icon: Palette,
      color: "pink"
    },
  ];

  /* =====================================
     🎨 COLOR MAP (CLEAN UI)
  ===================================== */
  const colorStyles = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      hover: "hover:bg-green-100"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      hover: "hover:bg-blue-100"
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      icon: "text-pink-600",
      hover: "hover:bg-pink-100"
    }
  };

  return (

    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* =====================================
         🔝 HEADER
      ===================================== */}
      <div className="text-center mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          Class {normalizedClass} Stream Selection
        </h1>

        <p className="text-gray-600 mt-2">
          Choose your stream to continue
        </p>

      </div>

      {/* =====================================
         📦 STREAM GRID
      ===================================== */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {streams.map((stream) => {

          const styles = colorStyles[stream.color] || {};
          const Icon = stream.icon;

          return (

            <Link
              key={stream.id}
              to={`/subjects/${normalizedClass}/${stream.id}`}
              className={`
                p-6 rounded-xl border ${styles.border}
                ${styles.bg} ${styles.hover}
                shadow-sm flex flex-col items-center text-center gap-3
                transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            >

              {/* ICON */}
              <div className="p-3 bg-white rounded-full shadow">
                <Icon size={30} className={styles.icon} />
              </div>

              {/* TITLE */}
              <span className="font-semibold text-lg">
                {stream.name}
              </span>

              {/* DESC */}
              <p className="text-sm text-gray-600">
                {stream.desc}
              </p>

            </Link>

          );

        })}

      </div>

      {/* =====================================
         🔙 BACK BUTTON
      ===================================== */}
      <div className="text-center mt-12">

        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline transition"
        >
          <ArrowLeft size={16} />
          Back to Classes
        </Link>

      </div>

    </div>

  );

}

export default Streams;