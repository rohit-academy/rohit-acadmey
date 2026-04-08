import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* 🔒 ROUTE GUARDS */
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AdminRoute from "../components/layout/AdminRoute";
import UserLayout from "../components/layout/UserLayout";

/* 🌍 USER PAGES */
import Home from "../pages/Home";
import Classes from "../pages/Classes";
import Streams from "../pages/Streams";
import Subjects from "../pages/Subjects";
import StudyMaterials from "../pages/StudyMaterials";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import MyDownloads from "../pages/MyDownloads";
import Account from "../pages/Account";
import SetupUsername from "../pages/SetupUsername";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";

/* 🔐 AUTH */
import Login from "../pages/auth/Login";
import AdminLogin from "../pages/AdminLogin";

/* ❌ COMMON */
import NotFound from "../pages/NotFound";

/* 🛠 ADMIN */
import AdminLayout from "../admin/layout/AdminLayout";
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import ManageAcademics from "../admin/academics/ManageAcademics";
import ManageClasses from "../admin/academics/ManageClasses";
import ManageSubjects from "../admin/academics/ManageSubjects";
import ManageStreams from "../admin/academics/ManageStreams";
import ManageMaterials from "../admin/materials/ManageMaterials";
import UploadMaterial from "../admin/materials/UploadMaterial";
import ManageUsers from "../admin/users/ManageUsers";
import OrdersAdmin from "../admin/orders/OrdersAdmin";
import Coupons from "../admin/finance/Coupons";
import SalesReport from "../admin/finance/SalesReport";

function AppRoutes() {

  const { user, loading } = useAuth();

  /* 🔥 SAFE ADMIN DETECT */
  let admin = null;

  try {
    const raw = localStorage.getItem("admin");
    admin = raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("admin");
    admin = null;
  }

  /* =====================================
     ⏳ GLOBAL LOADER
  ===================================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Routes>

      {/* ================= AUTH ================= */}

      {/* 🔐 USER LOGIN */}
      <Route
        path="/login"
        element={user ? <Navigate to="/account" replace /> : <Login />}
      />

      {/* 🔐 ADMIN LOGIN */}
      <Route
        path="/admin-login"
        element={
          admin?.token
            ? <Navigate to="/admin" replace />
            : <AdminLogin />
        }
      />

      {/* ✅ PAYMENT SUCCESS */}
      <Route path="/success" element={<Success />} />

      {/* ================= USER ================= */}
      <Route element={<UserLayout />}>

        <Route index element={<Home />} />

        <Route path="/classes" element={<Classes />} />

        <Route path="/streams/:classId" element={<Streams />} />

        <Route
          path="/subjects/:classId/:streamId"
          element={<Subjects />}
        />

        <Route
          path="/materials/:classId/:subjectId"
          element={<StudyMaterials />}
        />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* 🔐 PROTECTED USER */}
        <Route element={<ProtectedRoute />}>

          <Route path="/account" element={<Account />} />
          <Route path="/setup-username" element={<SetupUsername />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/downloads" element={<MyDownloads />} />

        </Route>

      </Route>

      {/* ================= ADMIN ================= */}

      <Route path="/admin" element={<AdminRoute />}>

        <Route element={<AdminLayout />}>

          <Route index element={<AdminDashboard />} />

          <Route path="academics" element={<ManageAcademics />} />
          <Route path="academics/classes" element={<ManageClasses />} />
          <Route path="academics/streams" element={<ManageStreams />} />
          <Route path="academics/subjects" element={<ManageSubjects />} />

          <Route path="materials" element={<ManageMaterials />} />
          <Route path="materials/upload" element={<UploadMaterial />} />

          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<OrdersAdmin />} />

          <Route path="coupons" element={<Coupons />} />
          <Route path="sales-report" element={<SalesReport />} />

        </Route>

      </Route>

      {/* ================= SAFETY ================= */}

      <Route
        path="/subjects/:classId"
        element={<Navigate to="/classes" replace />}
      />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;