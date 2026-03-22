import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle, Download, Home } from "lucide-react";
import API from "../services/api";

function Success() {

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {

    const handleSuccess = async () => {

      try {

        const params = new URLSearchParams(location.search);

        const token = params.get("token");       // 🔐 Google login
        const payment = params.get("payment");   // 💳 payment success flag

        /* 🔐 SAVE TOKEN (Google Login) */
        if (token) {
          localStorage.setItem("token", token);
          setMessage("Logging you in...");
        }

        /* 🔥 FETCH USER (important) */
        try {
          await API.get("/auth/me");
        } catch (err) {
          console.log("User fetch failed");
        }

        /* 💳 PAYMENT SUCCESS FLOW */
        if (payment === "success") {
          setMessage("Unlocking your materials...");
          
          // 🔥 FUTURE: backend download entry create
          // await API.post("/orders/save-downloads");

        }

        /* ⏳ UX DELAY */
        setTimeout(() => {
          setLoading(false);
        }, 800);

      } catch (error) {

        console.error(error);
        navigate("/login");

      }

    };

    handleSuccess();

  }, [location, navigate]);

  /* 🔄 LOADING */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">

        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>

        <p className="text-lg font-medium text-gray-700">
          {message}
        </p>

      </div>
    );
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="max-w-xl w-full text-center bg-white p-8 sm:p-10 rounded-2xl shadow-lg">

        {/* ✅ ICON */}
        <CheckCircle
          className="mx-auto text-green-500 mb-4"
          size={70}
        />

        {/* 🎉 TITLE */}
        <h1 className="text-3xl font-bold mb-2 text-green-700">
          Success!
        </h1>

        <p className="text-gray-600 mb-6">
          Your materials are ready. You can download them anytime.
        </p>

        {/* 🚀 ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          {/* DOWNLOAD */}
          <button
            onClick={() => navigate("/downloads")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download size={18} />
            Go to My Downloads
          </button>

          {/* HOME */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            <Home size={18} />
            Back to Home
          </Link>

        </div>

      </div>

    </div>

  );

}

export default Success;