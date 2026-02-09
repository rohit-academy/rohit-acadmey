import rateLimit from "express-rate-limit";

/* 📲 OTP RATE LIMITER */
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5, // 1 min me max 5 OTP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Try again in 1 minute."
    });
  }
});


/* 🔐 LOGIN / AUTH RATE LIMITER */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 1 min me max 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down."
    });
  }
});
