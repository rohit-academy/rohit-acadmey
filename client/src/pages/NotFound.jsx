import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, BookOpen } from "lucide-react";

function NotFound() {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center bg-white p-10 rounded-xl shadow max-w-lg w-full">

        <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={60} />

        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for isn't available or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Home size={18} /> Go Home
          </Link>

          <Link
            to="/classes"
            className="flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            <BookOpen size={18} /> Browse Classes
          </Link>

        </div>
      </div>
    </div>
  );
}

export default NotFound;
