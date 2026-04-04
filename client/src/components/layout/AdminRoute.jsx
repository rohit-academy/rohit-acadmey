import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminRoute() {

  const location = useLocation();

  /* =====================================
     🔐 GET ADMIN DATA
  ===================================== */
  let admin = null;

  try {
    admin = JSON.parse(localStorage.getItem("admin") || "{}");
  } catch {
    localStorage.removeItem("admin");
  }

  const token = admin?.token;
  const role = admin?.role;

  /* =====================================
     ❌ NOT AUTHORIZED
  ===================================== */
  if (!token || role !== "admin") {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* =====================================
     ✅ AUTHORIZED
  ===================================== */
  return <Outlet />;
}

export default React.memo(AdminRoute);