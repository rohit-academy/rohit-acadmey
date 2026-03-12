import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  BookOpen,
  UploadCloud
} from "lucide-react";

function AdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  const pageTitleMap = {
    "/admin": "Dashboard",
    "/admin/materials": "Materials",
    "/admin/materials/upload": "Upload Material",
    "/admin/users": "Users",
    "/admin/orders": "Orders",
    "/admin/academics": "Academics",
    "/admin/academics/classes": "Manage Classes"
  };

  const pageTitle = pageTitleMap[location.pathname] || "Admin";

  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";

  return (

    <div className="flex min-h-screen bg-slate-100">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
        fixed md:sticky top-0 left-0 z-40
        w-64 h-screen
        bg-white border-r shadow-sm
        p-6
        flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* HEADER */}

        <div className="flex items-center justify-between md:block">

          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-1">
              Rohit Academy
            </h2>

            <p className="text-xs text-gray-500 mb-6">
              Admin Panel
            </p>
          </div>

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-2 text-gray-700 flex-1 overflow-y-auto">

          {/* Dashboard */}

          <NavLink
            to="/admin"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          {/* Academics */}

          <NavLink
            to="/admin/academics"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <BookOpen size={18} /> Academics
          </NavLink>

          <NavLink
            to="/admin/academics/classes"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ml-6 ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            🎓 Manage Classes
          </NavLink>

          {/* MATERIALS */}

          <NavLink
            to="/admin/materials"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <FileText size={18} /> Materials
          </NavLink>

          <NavLink
            to="/admin/materials/upload"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ml-6 ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "hover:bg-gray-100 text-green-600"
              }`
            }
          >
            <UploadCloud size={18} /> Upload Material
          </NavLink>

          {/* USERS */}

          <NavLink
            to="/admin/users"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <Users size={18} /> Users
          </NavLink>

          {/* ORDERS */}

          <NavLink
            to="/admin/orders"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <ShoppingCart size={18} /> Orders
          </NavLink>

        </nav>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-600 px-3 py-2 mt-4"
        >
          <LogOut size={18} /> Logout
        </button>

      </aside>

      {/* MAIN AREA */}

      <div className="flex-1 flex flex-col">

        {/* MOBILE HEADER */}

        <header className="bg-white border-b px-4 py-3 flex items-center justify-between md:hidden">

          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <h1 className="font-semibold text-blue-600">
            {pageTitle}
          </h1>

        </header>

        {/* DESKTOP PAGE HEADER */}

        <div className="hidden md:flex items-center justify-between px-10 py-6">

          <h1 className="text-2xl font-semibold text-gray-800">
            {pageTitle}
          </h1>

        </div>

        {/* PAGE CONTENT */}

        <main className="flex-1 px-6 md:px-10 pb-10 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>

  );

}

export default AdminLayout;