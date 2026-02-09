import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">

      {/* 🔝 Navbar */}
      <Navbar />

      {/* 📄 Page Content */}
      <main className="flex-grow w-full">
        <div className="container py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* 🔻 Footer */}
      <Footer />

    </div>
  );
}

export default UserLayout;
