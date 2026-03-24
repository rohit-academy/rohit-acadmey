import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import { otpLimiter, authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* ========================================
   🔍 VALIDATION MIDDLEWARE
======================================== */
const validatePhone = (req, res, next) => {
  const phone = req.body.phone;

  if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) {
    return res.status(400).json({
      success: false,
      message: "Valid 10-digit phone required",
    });
  }

  next();
};

const validateOtp = (req, res, next) => {
  const { otp } = req.body;

  if (!otp || !/^\d{4,6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP format",
    });
  }

  next();
};

/* ========================================
   📲 OTP ROUTES
======================================== */

/* 📲 SEND OTP */
router.post("/send", otpLimiter, validatePhone, sendOtp);

/* 🔐 VERIFY OTP */
router.post("/verify", authLimiter, validatePhone, validateOtp, verifyOtp);

export default router;