import React from "react";
import { Routes, Route } from "react-router-dom";

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
import SetupUsername from "../pages/SetupUsername"; // 🔥 NEW

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
import ManageMaterials from "../admin/materials/ManageMaterials";
import UploadMaterial from "../admin/materials/UploadMaterial";
import ManageUsers from "../admin/users/ManageUsers";
import OrdersAdmin from "../admin/orders/OrdersAdmin";
import Coupons from "../admin/finance/Coupons";
import SalesReport from "../admin/finance/SalesReport";

function AppRoutes() {

  return (

    <Routes>

      {/* =========================
          🔐 AUTH ROUTES
      ========================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* 🔥 GOOGLE CALLBACK */}
      <Route path="/auth/success" element={<Success />} />


      {/* =========================
          🌍 USER WEBSITE
      ========================= */}

      <Route element={<UserLayout />}>

        {/* 🏠 HOME */}
        <Route index element={<Home />} />

        {/* 📚 CLASSES */}
        <Route path="/classes" element={<Classes />} />

        {/* 🎓 STREAMS */}
        <Route path="/streams/:classId" element={<Streams />} />

        {/* 📖 SUBJECTS */}
        <Route path="/subjects/:classId" element={<Subjects />} />
        <Route path="/subjects/:classId/:streamId" element={<Subjects />} />

        {/* 📄 MATERIALS */}
        <Route
          path="/materials/:classId/:subjectId"
          element={<StudyMaterials />}
        />

        {/* 📦 PRODUCT */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* 🛒 CART */}
        <Route path="/cart" element={<Cart />} />

        {/* 👤 ACCOUNT */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* 🆕 SET USERNAME (🔥 IMPORTANT FLOW) */}
        <Route
          path="/setup-username"
          element={
            <ProtectedRoute>
              <SetupUsername />
            </ProtectedRoute>
          }
        />

        {/* 💳 CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* ✅ PAYMENT SUCCESS */}
        <Route path="/success" element={<Success />} />

        {/* 📥 DOWNLOADS */}
        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <MyDownloads />
            </ProtectedRoute>
          }
        />

      </Route>


      {/* =========================
          🛠 ADMIN PANEL
      ========================= */}

      <Route path="/admin" element={<AdminRoute />}>

        <Route element={<AdminLayout />}>

          {/* 📊 DASHBOARD */}
          <Route index element={<AdminDashboard />} />

          {/* 📚 ACADEMICS */}
          <Route path="academics" element={<ManageAcademics />} />
          <Route path="academics/classes" element={<ManageClasses />} />
          <Route path="academics/subjects" element={<ManageSubjects />} />

          {/* 📦 MATERIALS */}
          <Route path="materials" element={<ManageMaterials />} />
          <Route path="materials/upload" element={<UploadMaterial />} />

          {/* 👤 USERS */}
          <Route path="users" element={<ManageUsers />} />

          {/* 🧾 ORDERS */}
          <Route path="orders" element={<OrdersAdmin />} />

          {/* 💰 FINANCE */}
          <Route path="coupons" element={<Coupons />} />
          <Route path="sales-report" element={<SalesReport />} />

        </Route>

      </Route>


      {/* =========================
          ❌ 404
      ========================= */}

      <Route path="*" element={<NotFound />} />

    </Routes>

  );

}

export default AppRoutes;