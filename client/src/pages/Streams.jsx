import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Atom, Calculator, Palette, ArrowLeft } from "lucide-react";

function Streams() {

  const { classId } = useParams();

  /* 🔥 NORMALIZE */
  const validClasses = ["11", "12"];
  const normalizedClass = String(classId || "").trim();

  /* ❌ INVALID CLASS */
  if (!validClasses.includes(normalizedClass)) {
    return <Navigate to="/classes" replace />;
  }

  /* 📚 STREAMS DATA */
  const streams = [
    {
      id: "pcb",
      name: "PCB (Biology Group)",
      desc: "Physics • Chemistry • Biology",
      icon: <Atom size={32} className="text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-200"
    },
    {
      id: "pcm",
      name: "PCM (Maths Group)",
      desc: "Physics • Chemistry • Mathematics",
      icon: <Calculator size={32} className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      id: "arts",
      name: "Arts Stream",
      desc: "History • Geography • Political Science & more",
      icon: <Palette size={32} className="text-pink-600" />,
      bg: "bg-pink-50",
      border: "border-pink-200"
    },
  ];

  return (

    <div className="max-w-5xl mx-auto px-4">

      {/* HEADER */}
      <div className="text-center mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          Class {normalizedClass} Stream Selection
        </h1>

        <p className="text-gray-600 mt-2">
          Choose your stream to view subjects and study materials
        </p>

      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {streams.map((stream) => (

          <Link
            key={stream.id}
            to={`/subjects/${normalizedClass}/${stream.id}`} // ✅ FIXED (SAFE)
            className={`
              p-6 rounded-xl border ${stream.border}
              shadow-sm flex flex-col items-center text-center gap-3
              ${stream.bg}
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
              active:scale-95
            `}
          >

            {stream.icon}

            <span className="font-semibold text-lg">
              {stream.name}
            </span>

            <p className="text-sm text-gray-600">
              {stream.desc}
            </p>

          </Link>

        ))}

      </div>

      {/* BACK BUTTON */}
      <div className="text-center mt-10">

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