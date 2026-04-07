import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

function ProtectedRoute({ requiredRole }) {

  const { user, loading } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("token");

  /* =====================================
     ⏳ LOADING
  ===================================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader text="Checking authentication..." />
      </div>
    );
  }

  /* =====================================
     🔒 USER NOT LOGGED IN
  ===================================== */
  if (!token || !user) {
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