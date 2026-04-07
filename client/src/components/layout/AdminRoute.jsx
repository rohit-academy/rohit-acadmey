import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminRoute() {

  const location = useLocation();

  /* =====================================
     🔐 SAFE ADMIN READ
  ===================================== */
  let admin = null;

  try {
    const raw = localStorage.getItem("admin");
    admin = raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("admin");
    admin = null;
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