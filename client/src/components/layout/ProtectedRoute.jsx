import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

function ProtectedRoute({ children, requiredRole }) {

  const { user, loading } = useAuth();
  const location = useLocation();

  /* =====================================
     ⏳ LOADING (CENTERED UI)
  ===================================== */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader text="Checking authentication..." />
      </div>
    );
  }

  /* =====================================
     🔒 NOT LOGGED IN
  ===================================== */
  if (!user) {

    // 🔥 prevent loop
    if (location.pathname === "/login") {
      return children;
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search // ✅ keep query params
        }}
      />
    );
  }

  /* =====================================
     🚫 ROLE BASED ACCESS (OPTIONAL)
  ===================================== */
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  /* =====================================
     ✅ AUTHORIZED
  ===================================== */
  return children || null;
}

export default React.memo(ProtectedRoute);