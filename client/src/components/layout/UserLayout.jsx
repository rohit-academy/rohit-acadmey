import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "../ui/Loader";

function UserLayout() {

  const { loading } = useAuth();

  /* =====================================
     ⏳ GLOBAL AUTH LOADING (IMPORTANT)
  ===================================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (

    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">

      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* 📄 MAIN CONTENT */}
      <main className="flex-grow w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          <Outlet />

        </div>

      </main>

      {/* 🔻 FOOTER */}
      <Footer />

    </div>

  );
}

export default UserLayout;