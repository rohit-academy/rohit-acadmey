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
   🔥 FIREBASE LOGIN (MAIN AUTH)
===================================== */
router.post("/firebase-login", authLimiter, firebaseLogin);

/* =====================================
   👤 GET CURRENT USER
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