import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import API from "../../services/api";

function AdminRoute() {

  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {

    const verifyAdmin = async () => {

      try {

        /* =====================================
           🔐 LOCAL CHECK (FAST)
        ===================================== */
        const raw = localStorage.getItem("admin");

        if (!raw) {
          setIsValid(false);
          return;
        }

        let admin;

        try {
          admin = JSON.parse(raw);
        } catch {
          localStorage.removeItem("admin");
          setIsValid(false);
          return;
        }

        /* ❌ INVALID TOKEN OR ROLE */
        if (!admin?.token || admin?.role !== "admin") {
          localStorage.removeItem("admin");
          setIsValid(false);
          return;
        }

        /* =====================================
           ⚡ INSTANT ALLOW (UX FAST)
        ===================================== */
        setIsValid(true);

        /* =====================================
           🔍 BACKGROUND VERIFY (NO BLOCK)
        ===================================== */
        try {
          await API.get("/admin/stats");
        } catch (err) {

          console.warn("⚠️ Admin token expired");

          localStorage.removeItem("admin");
          localStorage.removeItem("token");

          setIsValid(false);
        }

      } catch (error) {

        console.error("❌ Admin verification error:", error);

        localStorage.removeItem("admin");
        localStorage.removeItem("token");

        setIsValid(false);
      }

    };

    verifyAdmin();

  }, []);

  /* =====================================
     ⏳ LOADING
  ===================================== */
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* =====================================
     ❌ NOT AUTHORIZED
  ===================================== */
  if (!isValid) {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* =====================================
     ✅ AUTHORIZED
  ===================================== */
  return <Outlet />;
}

export default React.memo(AdminRoute);