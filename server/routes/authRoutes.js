import express from "express";
import { loginWithPhone, getMe, adminLogin } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* 📲 Phone login after OTP */
router.post("/login-phone", authLimiter, loginWithPhone);

/* 👤 Get logged in user */
router.get("/me", authMiddleware, getMe);

/* 🛠 Admin login */
router.post("/admin-login", authLimiter, adminLogin);

export default router;
