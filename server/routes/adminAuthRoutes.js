import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   🔍 VALIDATION
===================================== */
const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  next();
};

/* =====================================
   🔐 ADMIN LOGIN
===================================== */
router.post(
  "/login",
  authLimiter,        // 🔥 anti-brute-force
  validateAdminLogin, // 🔍 input check
  adminLogin
);

export default router;