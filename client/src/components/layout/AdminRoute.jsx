import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const adminData = localStorage.getItem("admin");

  /* ❌ Not logged in */
  if (!adminData) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const admin = JSON.parse(adminData);

    /* ❌ Token missing */
    if (!admin?.token) {
      return <Navigate to="/admin-login" replace />;
    }

    /* ✅ Allow nested admin routes */
    return <Outlet />;
  } catch (error) {
    console.error("AdminRoute parse error:", error);
    return <Navigate to="/admin-login" replace />;
  }
}

export default AdminRoute;
