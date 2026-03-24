import rateLimit from "express-rate-limit";

/* =====================================
   📲 OTP RATE LIMITER (PHONE BASED)
===================================== */
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 3, // 🔥 stricter
  standardHeaders: true,
  legacyHeaders: false,

  /* 🔥 KEY: PHONE BASED */
  keyGenerator: (req) => {
    const phone = req.body.phone || req.ip;
    return phone;
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Try again in 1 minute."
    });
  }
});

/* =====================================
   🔐 AUTH RATE LIMITER (IP + USER)
===================================== */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return req.body.phone || req.body.email || req.ip;
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down."
    });
  }
});