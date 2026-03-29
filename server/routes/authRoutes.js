import express from "express";

import {
  getMe,
  adminLogin,
  setUsername,
  firebaseLogin
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   🧪 DEBUG ROUTE (TEST KARNE KE LIYE)
===================================== */
router.get("/test", (req, res) => {
  console.log("✅ AUTH ROUTE WORKING");
  res.json({
    success: true,
    message: "Auth route working 🚀"
  });
});

/* =====================================
   🔥 FIREBASE LOGIN (MAIN AUTH)
===================================== */
router.post("/firebase-login", authLimiter, (req, res, next) => {
  console.log("🔥 /firebase-login HIT");
  console.log("📦 BODY:", req.body);

  next(); // ➡️ actual controller pe bhej
}, firebaseLogin);

/* =====================================
   👤 GET CURRENT USER
===================================== */
router.get("/me", authMiddleware, (req, res, next) => {
  console.log("👤 /me HIT", req.user);
  next();
}, getMe);

/* =====================================
   🆕 SET USERNAME
===================================== */
router.put("/set-username", authMiddleware, (req, res, next) => {
  console.log("🆕 set-username HIT", req.body);
  next();
}, setUsername);

/* =====================================
   🛠 ADMIN LOGIN
===================================== */
router.post("/admin-login", authLimiter, (req, res, next) => {
  console.log("🛠 admin-login HIT");
  next();
}, adminLogin);

export default router;