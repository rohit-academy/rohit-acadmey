import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Download, LogOut } from "lucide-react";

function Account() {

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // 🔄 WAIT UNTIL USER LOAD
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 🔐 PROTECTED ROUTE
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout(); // clear context + token
    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-slate-50 px-4 py-6">

      <div className="max-w-3xl mx-auto">

        {/* 👤 PROFILE */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-blue-600" />
              )}

            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {user.name || "Student"}
              </h2>

              <p className="text-gray-600 text-sm">
                {user.email || user.phone}
              </p>
            </div>

          </div>

        </div>

        {/* 📥 DOWNLOADS */}
        <div
          onClick={() => navigate("/downloads")}
          className="bg-white p-5 rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-md transition mb-4"
        >

          <div className="flex items-center gap-3">
            <Download className="text-blue-600" />
            <span className="font-medium">My Downloads</span>
          </div>

          <span>→</span>

        </div>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>

  );

}

export default Account;