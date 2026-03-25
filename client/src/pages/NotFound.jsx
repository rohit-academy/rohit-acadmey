import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, BookOpen, ArrowLeft } from "lucide-react";

function NotFound() {

  const navigate = useNavigate();

  /* 🔥 OPTIONAL AUTO REDIRECT (UX BOOST) */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 8000); // 8 sec

    return () => clearTimeout(timer);
  }, [navigate]);

  return (

    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-slate-100">

      <div
        className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full relative overflow-hidden"
        role="alert"
      >

        {/* ICON */}
        <div className="flex justify-center mb-6">

          <div className="bg-yellow-100 p-5 rounded-full">

            <AlertTriangle
              className="text-yellow-500"
              size={50}
            />

          </div>

        </div>

        {/* 404 */}
        <h1 className="text-6xl font-extrabold text-gray-800 mb-2 tracking-wider">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-6 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <p className="text-sm text-gray-400 mb-8">
          Redirecting to home in a few seconds...
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Home size={18} /> Home
          </Link>

          <Link
            to="/classes"
            className="flex items-center justify-center gap-2 bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            <BookOpen size={18} /> Classes
          </Link>

        </div>

        {/* DECOR */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>

      </div>

    </div>

  );

}

export default NotFound;