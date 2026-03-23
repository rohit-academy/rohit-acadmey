import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SetupUsername() {

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md w-full">

        <h1 className="text-2xl font-bold mb-4">
          Your Username
        </h1>

        <div className="bg-gray-100 p-4 rounded-lg text-lg font-semibold mb-6">
          @{user?.name}
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