import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import API from "../../services/api";

function AdminRoute() {

  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {

    const verifyAdmin = async () => {

      try {

        const adminData = localStorage.getItem("admin");

        if (!adminData) {
          setIsValid(false);
          return;
        }

        const admin = JSON.parse(adminData);

        if (!admin?.token) {
          setIsValid(false);
          return;
        }

        /* 🔐 VERIFY WITH SERVER */
        await API.get("/admin/stats"); // protected route

        setIsValid(true);

      } catch (error) {

        console.error("Admin verification failed");

        localStorage.removeItem("admin");

        setIsValid(false);

      }

    };

    verifyAdmin();

  }, []);

  /* ⏳ LOADING */
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ❌ NOT AUTHORIZED */
  if (!isValid) {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* ✅ ALLOWED */
  return <Outlet />;
}

export default React.memo(AdminRoute);