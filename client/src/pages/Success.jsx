import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle, Download, Home } from "lucide-react";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      /* 🔐 SAVE TOKEN */
      localStorage.setItem("token", token);

      /* ⏳ Small delay for UX */
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      /* ❌ No token → go login */
      navigate("/login");
    }
  }, [location, navigate]);

  /* 🔄 LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Logging you in...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center bg-white p-10 rounded-xl shadow mt-10">

      <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />

      <h1 className="text-3xl font-bold mb-2 text-green-700">
        Payment Successful!
      </h1>

      <p className="text-gray-600 mb-6">
        Your study materials have been unlocked and are ready for download.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">

        {/* 🔥 IMPORTANT FIX */}
        <button
          onClick={() => navigate("/downloads")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Download size={18} /> Go to My Downloads
        </button>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          <Home size={18} /> Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Success;