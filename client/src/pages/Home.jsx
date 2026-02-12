import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Download, Star, ArrowRight } from "lucide-react";

function Home() {
  const elementsRef = useRef([]);

  const classes = [
    { name: "Class 9", route: "/subjects/9" },
    { name: "Class 10", route: "/subjects/10" },
    { name: "Class 11", route: "/streams/11" },
    { name: "Class 12", route: "/streams/12" },
    { name: "BA", route: "/subjects/ba", comingSoon: true },
    { name: "BSc", route: "/subjects/bsc", comingSoon: true },
    { name: "BCom", route: "/subjects/bcom", comingSoon: true },
  ];

  /* 🔥 Mobile Only Scroll Animation */
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-x-16", "-translate-x-16");
          } else {
            entry.target.classList.add("opacity-0");
            if (entry.target.dataset.side === "left") {
              entry.target.classList.add("-translate-x-16");
            } else {
              entry.target.classList.add("translate-x-16");
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    elementsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div>

      {/* HERO */}
      <section className="text-center py-14 md:py-24 bg-gradient-to-r from-blue-50 via-white to-indigo-50 rounded-xl shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          All Classes Study Material in One Place
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
          Notes, Sample Papers & Previous Year Questions for School and College students.
        </p>

        {/* 🔥 PREMIUM CTA BUTTON WITH PARTICLES */}
        <div className="relative inline-block">

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          <Link
            to="/classes"
            className="relative inline-flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-medium text-white 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            shadow-lg overflow-hidden group 
            transition-all duration-300 
            hover:scale-105 hover:shadow-xl 
            active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse Classes
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>

            {/* Shine Sweep */}
            <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-out" />

            {/* Glow Pulse */}
            <span className="absolute inset-0 rounded-xl ring-2 ring-blue-400/30 animate-pulse" />
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-4 gap-6 mt-14 text-center">
        {[
          {
            icon: <BookOpen size={28} />,
            title: "Updated Syllabus",
            text: "Latest exam-oriented material",
            color: "from-blue-400 to-indigo-500"
          },
          {
            icon: <FileText size={28} />,
            title: "Sample Papers",
            text: "Practice like real exams",
            color: "from-green-400 to-emerald-500"
          },
          {
            icon: <Download size={28} />,
            title: "Instant Download",
            text: "Access after purchase",
            color: "from-orange-400 to-pink-500"
          },
          {
            icon: <Star size={28} />,
            title: "Top Quality Notes",
            text: "Made for exam success",
            color: "from-purple-400 to-fuchsia-500"
          }
        ].map((item, index) => (
          <div
            key={index}
            ref={(el) => (elementsRef.current[index] = el)}
            data-side={index % 2 === 0 ? "left" : "right"}
            className={`
              p-6 rounded-2xl shadow-lg text-white
              bg-gradient-to-br ${item.color}
              transition-all duration-700
              md:opacity-100 md:translate-x-0
              opacity-0
              ${index % 2 === 0 ? "-translate-x-16" : "translate-x-16"}
            `}
          >
            <div className="mx-auto mb-3">{item.icon}</div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm opacity-90 mt-1">{item.text}</p>
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
              ref={(el) => (elementsRef.current[index + 4] = el)}
              data-side={index % 2 === 0 ? "left" : "right"}
              className={`
                relative p-6 rounded-2xl text-center font-semibold shadow-md
                transition-all duration-700
                md:opacity-100 md:translate-x-0
                opacity-0
                ${index % 2 === 0 ? "-translate-x-16" : "translate-x-16"}
                ${
                  cls.comingSoon
                    ? "bg-gradient-to-br from-yellow-200 to-yellow-300 text-gray-700"
                    : "bg-gradient-to-br from-blue-100 to-indigo-200 hover:shadow-xl hover:-translate-y-1"
                }
              `}
            >
              {cls.name}

              {cls.comingSoon && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
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
