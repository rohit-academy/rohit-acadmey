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
import SetupUsername from "../pages/SetupUsername";

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

      {/* 🔐 AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* 🔥 GOOGLE CALLBACK */}
      <Route path="/success" element={<Success />} />

      {/* 🌍 USER */}
      <Route element={<UserLayout />}>

        <Route index element={<Home />} />

        <Route path="/classes" element={<Classes />} />
        <Route path="/streams/:classId" element={<Streams />} />

        {/* ✅ CLEAN SUBJECT ROUTE */}
        <Route path="/subjects/:classId/:streamId?" element={<Subjects />} />

        <Route
          path="/materials/:classId/:subjectId"
          element={<StudyMaterials />}
        />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/setup-username"
          element={
            <ProtectedRoute>
              <SetupUsername />
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

        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <MyDownloads />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* 🛠 ADMIN */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>

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