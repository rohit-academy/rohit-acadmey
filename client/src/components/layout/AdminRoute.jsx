import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("admin") === "true";

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return children;
}

export default AdminRoute;
