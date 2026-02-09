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
import Login from "../pages/auth/Login";          // ✅ FIXED
import AdminLogin from "../pages/AdminLogin"; // ✅ FIXED
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
      {/* 🌍 USER WEBSITE LAYOUT */}
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
        <Route path="/login" element={<Login />} />

        <Route
          path="/downloads"
          element={<ProtectedRoute><MyDownloads /></ProtectedRoute>}
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute><Checkout /></ProtectedRoute>}
        />
      </Route>

      {/* 🔐 ADMIN LOGIN */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* 🛠 ADMIN PANEL */}
      <Route
        path="/admin"
        element={<AdminRoute><AdminLayout /></AdminRoute>}
      >
        <Route index element={<AdminDashboard />} />

        {/* 🎓 Academics */}
        <Route path="academics" element={<ManageAcademics />} />
        <Route path="academics/classes" element={<ManageClasses />} />
        <Route path="academics/subjects" element={<ManageSubjects />} />

        {/* 📚 Materials */}
        <Route path="materials" element={<ManageMaterials />} />
        <Route path="materials/upload" element={<UploadMaterial />} />

        {/* 👤 Users */}
        <Route path="users" element={<ManageUsers />} />

        {/* 🛒 Orders */}
        <Route path="orders" element={<OrdersAdmin />} />

        {/* 💰 Finance */}
        <Route path="coupons" element={<Coupons />} />
        <Route path="sales-report" element={<SalesReport />} />
      </Route>

      {/* ❌ 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
