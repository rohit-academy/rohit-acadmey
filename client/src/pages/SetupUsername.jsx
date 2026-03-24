import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

function SetupUsername() {

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 🔄 WAIT UNTIL USER LOAD
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 🔐 NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 NOT GOOGLE USER
  if (user.authProvider !== "google") {
    return <Navigate to="/account" replace />;
  }

  const username = user.name || "user";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md w-full">

        <h1 className="text-2xl font-bold mb-4">
          Your Username
        </h1>

        <div className="bg-gray-100 p-4 rounded-lg text-lg font-semibold mb-6">
          @{username}
        </div>

        <button
          onClick={() => navigate("/account")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue
        </button>

      </div>

    </div>
  );
}

export default SetupUsername;