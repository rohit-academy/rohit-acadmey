import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Download, Star, ArrowRight } from "lucide-react";

function Home() {
  const cardsRef = useRef([]);

  const classes = [
    { name: "Class 9", route: "/subjects/9" },
    { name: "Class 10", route: "/subjects/10" },
    { name: "Class 11", route: "/streams/11" },
    { name: "Class 12", route: "/streams/12" },
    { name: "BA", route: "/subjects/ba", comingSoon: true },
    { name: "BSc", route: "/subjects/bsc", comingSoon: true },
    { name: "BCom", route: "/subjects/bcom", comingSoon: true },
  ];

  /* 🔥 Mobile Scroll Animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.remove("translate-x-10");
            entry.target.classList.remove("-translate-x-10");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>

      {/* HERO */}
      <section className="text-center py-14 md:py-24 bg-gradient-to-r from-blue-50 via-white to-indigo-50 rounded-xl shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          All Classes Study Material in One Place
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
          Notes, Sample Papers & Previous Year Questions for School and College students.
        </p>

        <Link
          to="/classes"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg shadow hover:bg-blue-700 hover:scale-105 transition"
        >
          Browse Classes <ArrowRight size={18} />
        </Link>
      </section>

      {/* FEATURES (Colorful Cards) */}
      <section className="grid md:grid-cols-4 gap-6 mt-14 text-center">
        
        {[
          {
            icon: <BookOpen size={28} />,
            title: "Updated Syllabus",
            text: "Latest exam-oriented material",
            bg: "from-blue-500 to-indigo-500"
          },
          {
            icon: <FileText size={28} />,
            title: "Sample Papers",
            text: "Practice like real exams",
            bg: "from-green-500 to-emerald-500"
          },
          {
            icon: <Download size={28} />,
            title: "Instant Download",
            text: "Access after purchase",
            bg: "from-orange-500 to-pink-500"
          },
          {
            icon: <Star size={28} />,
            title: "Top Quality Notes",
            text: "Made for exam success",
            bg: "from-purple-500 to-fuchsia-500"
          }
        ].map((feature, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className={`
              relative p-6 rounded-2xl text-white shadow-lg
              bg-gradient-to-br ${feature.bg}
              transition-all duration-700
              md:opacity-100 md:translate-x-0
              opacity-0
              ${index % 2 === 0 ? "-translate-x-10" : "translate-x-10"}
            `}
          >
            <div className="mx-auto mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm opacity-90 mt-1">{feature.text}</p>
          </div>
        ))}
      </section>

      {/* CLASS GRID */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Select Your Class
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {classes.map((cls, index) => (
            <Link
              key={cls.name}
              to={cls.route}
              ref={(el) => (cardsRef.current[index + 4] = el)}
              className={`
                relative p-6 rounded-2xl text-center font-semibold shadow-md
                transition-all duration-700
                md:opacity-100 md:translate-x-0
                opacity-0
                ${index % 2 === 0 ? "-translate-x-10" : "translate-x-10"}
                ${
                  cls.comingSoon
                    ? "bg-gray-100 text-gray-500"
                    : "bg-gradient-to-br from-blue-100 to-indigo-100 hover:shadow-xl hover:-translate-y-1"
                }
              `}
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
