import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "../ui/Loader";

function UserLayout() {

  const { loading } = useAuth();

  return (

    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">

      {/* 🔝 NAVBAR (always visible → no layout shift) */}
      <Navbar />

      {/* 📄 MAIN */}
      <main className="flex-grow w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          {/* 🔥 AUTH LOADING (only content area) */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader text="Loading your dashboard..." />
            </div>
          ) : (

            /* ⚡ SUPPORT LAZY ROUTES */
            <Suspense
              fallback={
                <div className="flex justify-center py-20">
                  <Loader text="Loading page..." />
                </div>
              }
            >
              <Outlet />
            </Suspense>

          )}

        </div>

      </main>

      {/* 🔻 FOOTER */}
      <Footer />

    </div>

  );
}

export default React.memo(UserLayout);