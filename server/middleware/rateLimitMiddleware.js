import rateLimit from "express-rate-limit";

/* =====================================
   📲 OTP RATE LIMITER
===================================== */
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return req.body?.phone || req.ip; // ✅ safe
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many OTP requests. Try again in 1 minute."
    });
  }
});

/* =====================================
   🔐 AUTH RATE LIMITER (FIXED)
===================================== */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return (
      req.body?.phone ||
      req.body?.email ||
      req.ip ||          // ✅ fallback
      "anonymous"        // ✅ ultimate fallback
    );
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down."
    });
  }
});