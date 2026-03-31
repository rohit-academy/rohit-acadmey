import React, { useState, useEffect } from "react";
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
  UploadCloud,
  Layers
} from "lucide-react";

function AdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================
     🔐 AUTH CHECK (SAFE FIX)
  ========================= */
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    if (!admin?.token) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  /* =========================
     🚪 LOGOUT
  ========================= */
  const handleLogout = () => {

    if (!window.confirm("Logout from admin panel?")) return;

    localStorage.clear(); // 🔥 clean all

    navigate("/admin-login", { replace: true });
  };

  /* =========================
     🧠 PAGE TITLE (SMART)
  ========================= */
  const getPageTitle = () => {

    const path = location.pathname;

    if (path.includes("/materials/upload")) return "Upload Material";
    if (path.includes("/materials")) return "Materials";
    if (path.includes("/users")) return "Users";
    if (path.includes("/orders")) return "Orders";
    if (path.includes("/academics/classes")) return "Manage Classes";
    if (path.includes("/academics/subjects")) return "Manage Subjects";
    if (path.includes("/academics/streams")) return "Manage Streams";
    if (path.includes("/academics")) return "Academics";

    return "Dashboard";
  };

  const pageTitle = getPageTitle();

  /* =========================
     🔗 NAV CONFIG (SCALABLE)
  ========================= */
  const navLinks = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin"
    },
    {
      title: "Academics",
      icon: <BookOpen size={18} />,
      path: "/admin/academics",
      children: [
        {
          title: "Manage Classes",
          path: "/admin/academics/classes"
        },
        {
          title: "Manage Streams",
          path: "/admin/academics/streams" // 🔥 NEW
        },
        {
          title: "Manage Subjects",
          path: "/admin/academics/subjects"
        }
      ]
    },
    {
      title: "Materials",
      icon: <FileText size={18} />,
      path: "/admin/materials",
      children: [
        {
          title: "Upload Material",
          path: "/admin/materials/upload",
          highlight: true
        }
      ]
    },
    {
      title: "Users",
      icon: <Users size={18} />,
      path: "/admin/users"
    },
    {
      title: "Orders",
      icon: <ShoppingCart size={18} />,
      path: "/admin/orders"
    }
  ];

  const baseLink =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";

  const activeStyle = "bg-blue-100 text-blue-700 font-semibold";

  return (

    <div className="flex min-h-screen bg-slate-100">

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 z-40
        w-64 h-screen bg-white border-r shadow-sm
        p-6 flex flex-col overflow-y-auto
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between md:block">

          <div>
            <h2 className="text-xl font-bold text-blue-600">
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

        {/* NAV */}
        <nav className="flex flex-col gap-2 flex-1 text-gray-700">

          {navLinks.map((item, i) => {

            const isActive = location.pathname.startsWith(item.path);

            return (
              <div key={i}>

                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={`${baseLink} ${
                    isActive ? activeStyle : "hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </NavLink>

                {/* CHILD LINKS */}
                {item.children && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">

                    {item.children.map((child, j) => {

                      const active = location.pathname === child.path;

                      return (
                        <NavLink
                          key={j}
                          to={child.path}
                          className={`${baseLink} ${
                            active
                              ? activeStyle
                              : "hover:bg-gray-100"
                          } ${
                            child.highlight
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          {child.title}
                        </NavLink>
                      );
                    })}

                  </div>
                )}

              </div>
            );
          })}

        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-600 px-3 py-2 mt-4"
        >
          <LogOut size={18} /> Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}
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

        {/* DESKTOP HEADER */}
        <div className="hidden md:flex items-center justify-between px-10 py-6">

          <h1 className="text-2xl font-semibold text-gray-800">
            {pageTitle}
          </h1>

        </div>

        {/* CONTENT */}
        <main className="flex-1 px-6 md:px-10 pb-10 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;