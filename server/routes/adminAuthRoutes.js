import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   🔍 VALIDATION MIDDLEWARE
===================================== */
const validateAdminLogin = (req, res, next) => {
  try {

    const { email, password } = req.body;

    /* ❌ REQUIRED CHECK */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    /* ❌ TYPE CHECK */
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input format"
      });
    }

    /* 🔹 NORMALIZE INPUT */
    req.body.email = email.toLowerCase().trim();
    req.body.password = password.trim();

    /* ❌ BASIC EMAIL FORMAT CHECK */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    /* ❌ PASSWORD LENGTH CHECK */
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    next();

  } catch (error) {
    console.error("Admin validation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Validation failed"
    });
  }
};

/* =====================================
   🔐 ADMIN LOGIN ROUTE
===================================== */
router.post(
  "/login",
  authLimiter,          // 🔥 rate limit (anti brute force)
  validateAdminLogin,   // 🔍 validation
  adminLogin            // 🔐 controller
);

export default router;