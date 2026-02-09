import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Download, Star, ArrowRight } from "lucide-react";

function Home() {
  const classes = [
    { name: "Class 9", route: "/subjects/9" },
    { name: "Class 10", route: "/subjects/10" },
    { name: "Class 11", route: "/streams/11" },
    { name: "Class 12", route: "/streams/12" },
    { name: "BA", route: "/subjects/ba", comingSoon: true },
    { name: "BSc", route: "/subjects/bsc", comingSoon: true },
    { name: "BCom", route: "/subjects/bcom", comingSoon: true },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="text-center py-14 md:py-24 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          All Classes Study Material in One Place
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
          Notes, Sample Papers & Previous Year Questions for School and College students.
        </p>

        <Link
          to="/classes"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow hover:bg-blue-700 transition"
        >
          Browse Classes <ArrowRight size={18} />
        </Link>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-4 gap-6 mt-14 text-center">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <BookOpen className="mx-auto text-blue-600 mb-2" size={28} />
          <h3 className="font-semibold">Updated Syllabus</h3>
          <p className="text-sm text-gray-600">Latest exam-oriented material</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <FileText className="mx-auto text-blue-600 mb-2" size={28} />
          <h3 className="font-semibold">Sample Papers</h3>
          <p className="text-sm text-gray-600">Practice like real exams</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <Download className="mx-auto text-blue-600 mb-2" size={28} />
          <h3 className="font-semibold">Instant Download</h3>
          <p className="text-sm text-gray-600">Access after purchase</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <Star className="mx-auto text-blue-600 mb-2" size={28} />
          <h3 className="font-semibold">Top Quality Notes</h3>
          <p className="text-sm text-gray-600">Made for exam success</p>
        </div>
      </section>

      {/* CLASS GRID */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select Your Class
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <Link
              key={cls.name}
              to={cls.route}
              className={`relative bg-white p-6 rounded-xl shadow text-center font-semibold transition
                ${cls.comingSoon ? "opacity-70 hover:shadow" : "hover:shadow-lg"}`}
            >
              {cls.name}

              {cls.comingSoon && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold">
                  Coming Soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
