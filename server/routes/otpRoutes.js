import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import { otpLimiter, authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* 📲 OTP send (strict) */
router.post("/send", otpLimiter, sendOtp);

/* 🔐 OTP verify (light limiter for brute force protection) */
router.post("/verify", authLimiter, verifyOtp);

export default router;
