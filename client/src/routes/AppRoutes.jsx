import React from "react";
import { Routes, Route } from "react-router-dom";

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
import Login from "../pages/auth/Login";

/* 🔐 ADMIN AUTH */
import AdminLogin from "../pages/AdminLogin";

/* ❌ COMMON */
import NotFound from "../pages/NotFound";

/* 🛠 ADMIN LAYOUT */
import AdminLayout from "../admin/layout/AdminLayout";

/* 🛠 ADMIN SECTIONS */
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import ManageAcademics from "../admin/academics/ManageAcademics";
import ManageClasses from "../admin/academics/ManageClasses";
import ManageSubjects from "../admin/academics/ManageSubjects";
import ManageMaterials from "../admin/materials/ManageMaterials";
import UploadMaterial from "../admin/materials/UploadMaterial";
import ManageUsers from "../admin/users/ManageUsers";
import OrdersAdmin from "../admin/orders/OrdersAdmin";
import Coupons from "../admin/finance/Coupons";
import SalesReport from "../admin/finance/SalesReport";

function AppRoutes() {
  return (
    <Routes>

      {/* 🔑 AUTH PAGES (NO LAYOUT) */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* 🌍 USER WEBSITE */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/streams/:classId" element={<Streams />} />
        <Route path="/subjects/:classId" element={<Subjects />} />
        <Route path="/subjects/:classId/:streamId" element={<Subjects />} />
        <Route path="/materials/:subjectId" element={<StudyMaterials />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<Success />} />

        {/* 🔒 USER PROTECTED */}
        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <MyDownloads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 🛠 ADMIN PANEL */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="academics" element={<ManageAcademics />} />
          <Route path="academics/classes" element={<ManageClasses />} />
          <Route path="academics/subjects" element={<ManageSubjects />} />

          <Route path="materials" element={<ManageMaterials />} />
          <Route path="materials/upload" element={<UploadMaterial />} />

          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<OrdersAdmin />} />

          <Route path="coupons" element={<Coupons />} />
          <Route path="sales-report" element={<SalesReport />} />
        </Route>
      </Route>

      {/* ❌ 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;