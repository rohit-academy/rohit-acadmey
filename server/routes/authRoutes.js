import express from "express";

import {
  loginWithPhone,
  getMe,
  adminLogin,
  setUsername,
  firebaseLogin
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   📲 PHONE LOGIN (optional)
===================================== */
router.post("/login-phone", authLimiter, loginWithPhone);

/* =====================================
   🔥 FIREBASE LOGIN (MAIN)
===================================== */
router.post("/firebase-login", firebaseLogin);

/* =====================================
   👤 GET LOGGED IN USER
===================================== */
router.get("/me", authMiddleware, getMe);

/* =====================================
   🆕 SET USERNAME
===================================== */
router.put("/set-username", authMiddleware, setUsername);

/* =====================================
   🛠 ADMIN LOGIN
===================================== */
router.post("/admin-login", authLimiter, adminLogin);

export default router;