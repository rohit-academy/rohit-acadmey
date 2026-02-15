import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  try {
    const adminData = localStorage.getItem("admin");

    /* ❌ Not logged in */
    if (!adminData) {
      return <Navigate to="/admin-login" replace />;
    }

    const admin = JSON.parse(adminData);

    /* ❌ Token missing */
    if (!admin?.token) {
      return <Navigate to="/admin-login" replace />;
    }

    /* ❌ Not admin role */
    if (admin?.role !== "admin") {
      return <Navigate to="/admin-login" replace />;
    }

    /* ✅ Access allowed */
    return children;

  } catch (error) {
    console.error("AdminRoute error:", error);
    return <Navigate to="/admin-login" replace />;
  }
}

export default AdminRoute;
