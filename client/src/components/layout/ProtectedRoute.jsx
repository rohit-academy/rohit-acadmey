import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // 🕒 Future: if auth loading state ho (API based login)
  if (user === undefined) {
    return <Loader />;
  }

  // 🔒 Not logged in → login page pe bhejo & original route yaad rakho
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ✅ Logged in → allow page
  return children;
}

export default ProtectedRoute;
