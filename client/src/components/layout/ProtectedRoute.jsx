import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

function ProtectedRoute({ requiredRole }) {

  const { user, loading } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("token");

  /* =====================================
     ⏳ LOADING STATE
  ===================================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader text="Checking authentication..." />
      </div>
    );
  }

  /* =====================================
     🔒 NOT LOGGED IN (SMART FIX 🔥)
  ===================================== */
  if (!token || !user) {

    /* 🔥 ADMIN ROUTES KO USER LOGIN PE MAT BHEJ */
    if (location.pathname.startsWith("/admin")) {
      return (
        <Navigate
          to="/admin-login"
          replace
          state={{ from: location.pathname }}
        />
      );
    }

    /* 🔐 NORMAL USER LOGIN */
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search
        }}
      />
    );
  }

  /* =====================================
     🚫 ROLE CHECK (OPTIONAL)
  ===================================== */
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  /* =====================================
     ✅ AUTHORIZED
  ===================================== */
  return <Outlet />;
}

export default React.memo(ProtectedRoute);