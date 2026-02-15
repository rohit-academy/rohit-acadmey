import React from "react";
import { Menu, LogOut, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    window.location.href = "/admin-login";
  };

  const goToUpload = () => {
    navigate("/admin/materials/upload");
  };

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between md:justify-end">

      {/* ☰ Mobile Menu Button */}
      <button onClick={toggleSidebar} className="md:hidden text-gray-700">
        <Menu size={24} />
      </button>

      {/* Title (mobile center look) */}
      <h1 className="font-semibold text-lg text-blue-600 md:hidden">
        Admin Panel
      </h1>

      {/* 👉 RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-3">

        {/* 📤 Upload Button */}
        <button
          onClick={goToUpload}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
        >
          <Upload size={18} /> Upload
        </button>

        {/* 🔓 Logout (desktop) */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

    </header>
  );
}

export default AdminNavbar;
