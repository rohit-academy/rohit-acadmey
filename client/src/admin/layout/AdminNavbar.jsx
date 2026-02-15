import React from "react";
import { Menu, LogOut } from "lucide-react";

function AdminNavbar({ toggleSidebar }) {

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 FIXED (admin → token)
    window.location.href = "/admin-login";
  };

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">

      {/* ☰ Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-700"
      >
        <Menu size={24} />
      </button>

      {/* 🧾 Title (mobile + desktop both) */}
      <h1 className="font-semibold text-lg text-blue-600">
        Admin Panel
      </h1>

      {/* 🔐 Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        <LogOut size={18} /> Logout
      </button>

    </header>
  );
}

export default AdminNavbar;
