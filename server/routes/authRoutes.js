import express from "express";
import passport from "passport";

import {
  loginWithPhone,
  getMe,
  adminLogin
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   📲 PHONE LOGIN
===================================== */
router.post("/login-phone", authLimiter, loginWithPhone);

/* =====================================
   👤 GET LOGGED IN USER (🔥 IMPORTANT)
===================================== */
router.get("/me", authMiddleware, getMe);

/*
👉 KYU IMPORTANT?
Frontend call karega:
API.get("/auth/me")

Account page ke liye:
- name
- email
- phone
- avatar
- role
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
        return res.redirect(
          `${process.env.FRONTEND_URL}/login`
        );
      }

      /* ✅ SUCCESS REDIRECT */
      res.redirect(
        `${process.env.FRONTEND_URL}/success?token=${token}`
      );

    } catch (error) {

      console.error("Google callback error:", error);

      res.redirect(
        `${process.env.FRONTEND_URL}/login`
      );

    }

  }
);

export default router;