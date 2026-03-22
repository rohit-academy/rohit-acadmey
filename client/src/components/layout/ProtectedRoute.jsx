import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

function ProtectedRoute({ children }) {

  const { user, loading } = useAuth();
  const location = useLocation();

  /* =====================================
     ⏳ WAIT FOR AUTH CHECK
  ===================================== */
  if (loading) {
    return <Loader />;
  }

  /* =====================================
     🔒 NOT LOGGED IN
  ===================================== */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* =====================================
     ✅ AUTHORIZED
  ===================================== */
  return children;
}

export default ProtectedRoute;