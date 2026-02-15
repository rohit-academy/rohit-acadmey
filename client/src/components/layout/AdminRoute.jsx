import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminRoute() {
  const location = useLocation();

  try {
    const adminData = localStorage.getItem("admin");

    if (!adminData) {
      return <Navigate to="/admin-login" replace state={{ from: location }} />;
    }

    const admin = JSON.parse(adminData);

    if (!admin?.token || admin?.role !== "admin") {
      return <Navigate to="/admin-login" replace state={{ from: location }} />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("AdminRoute error:", error);
    return <Navigate to="/admin-login" replace />;
  }
}

export default AdminRoute;
