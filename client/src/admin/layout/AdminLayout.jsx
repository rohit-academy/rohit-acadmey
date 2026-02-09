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
  BookOpen
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  // 🔥 Dynamic page title for mobile top bar
  const pageTitleMap = {
    "/admin": "Dashboard",
    "/admin/materials": "Materials",
    "/admin/users": "Users",
    "/admin/orders": "Orders",
    "/admin/academics": "Academics",
    "/admin/academics/classes": "Manage Classes"
  };

  const pageTitle = pageTitleMap[location.pathname] || "Admin";

  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition";

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* 📱 Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 SIDEBAR */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md p-6
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between md:block">
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-1">Rohit Academy</h2>
            <p className="text-xs text-gray-500 mb-6">Admin Panel</p>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 text-gray-700 mt-4">

          <NavLink
            to="/admin"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/academics"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
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
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            🎓 Manage Classes
          </NavLink>

          <NavLink
            to="/admin/materials"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <FileText size={18} /> Materials
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <Users size={18} /> Users
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            <ShoppingCart size={18} /> Orders
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 mt-8 px-3 py-2"
          >
            <LogOut size={18} /> Logout
          </button>

        </nav>
      </aside>

      {/* 🔹 MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* 🔝 Mobile Top Bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="font-semibold text-blue-600">{pageTitle}</h1>
        </header>

        <main className="p-6 md:p-10">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
