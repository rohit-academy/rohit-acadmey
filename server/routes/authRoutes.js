import express from "express";
import passport from "passport";

import {
  loginWithPhone,
  getMe,
  adminLogin,
  setUsername // 🔥 NEW
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   📲 PHONE LOGIN
===================================== */
router.post("/login-phone", authLimiter, loginWithPhone);

/* =====================================
   👤 GET LOGGED IN USER
===================================== */
router.get("/me", authMiddleware, getMe);

/* =====================================
   🆕 SET USERNAME (🔥 IMPORTANT)
===================================== */
router.put("/set-username", authMiddleware, setUsername);

/*
👉 Use case:
Google login ke baad
username empty ho → frontend redirect karega
/setup-username

phir yaha hit hoga:
PUT /api/auth/set-username
*/

/* =====================================
   🛠 ADMIN LOGIN
===================================== */
router.post("/admin-login", authLimiter, adminLogin);

/* =====================================
   🔵 GOOGLE LOGIN
===================================== */

/* 👉 STEP 1: Redirect to Google */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

/* 👉 STEP 2: Google Callback */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {

    try {

      /* 🔐 TOKEN from passport */
      const token = req.user?.token;

      if (!token) {
        console.warn("❌ Google login failed: No token");

        return res.redirect(
          `${process.env.FRONTEND_URL}/login`
        );
      }

      /* ✅ SUCCESS REDIRECT */
      res.redirect(
        `${process.env.FRONTEND_URL}/success?token=${token}`
      );

    } catch (error) {

      console.error("🔥 Google callback error:", error);

      res.redirect(
        `${process.env.FRONTEND_URL}/login`
      );

    }

  }
);

export default router;