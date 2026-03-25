import React from "react";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminNavbar({ toggleSidebar }) {

  const navigate = useNavigate();

  const handleLogout = () => {

    const confirmLogout = window.confirm("Logout from admin panel?");

    if (!confirmLogout) return;

    /* ✅ REMOVE ADMIN SESSION */
    localStorage.removeItem("admin");

    /* 🔥 OPTIONAL CLEANUP */
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    /* ✅ SAFE NAVIGATION */
    navigate("/admin-login", { replace: true });

  };

  return (

    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">

      {/* ☰ Mobile Menu */}
      <button
        onClick={() => toggleSidebar && toggleSidebar()}
        className="md:hidden text-gray-700"
      >
        <Menu size={24} />
      </button>

      {/* 🧾 Title */}
      <h1 className="font-semibold text-lg text-blue-600">
        Admin Panel
      </h1>

      {/* 🔐 Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={18} /> Logout
      </button>

    </header>

  );

}

export default AdminNavbar;