import express from "express";
import passport from "passport";

import {
  loginWithPhone,
  getMe,
  adminLogin,
  setUsername
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
   🆕 SET USERNAME
===================================== */
router.put("/set-username", authMiddleware, setUsername);

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

      /* =====================================
         🔐 EXTRACT FROM PASSPORT (🔥 FIXED)
      ===================================== */
      const token = req.user?.token;
      const user = req.user?.user; // optional (future use)

      if (!token) {
        console.warn("❌ Google login failed: No token");

        return res.redirect(
          `${process.env.FRONTEND_URL}/login`
        );
      }

      /* =====================================
         ✅ SUCCESS REDIRECT
      ===================================== */
      return res.redirect(
        `${process.env.FRONTEND_URL}/success?token=${token}`
      );

    } catch (error) {

      console.error("🔥 Google callback error:", error);

      return res.redirect(
        `${process.env.FRONTEND_URL}/login`
      );

    }

  }
);

export default router;