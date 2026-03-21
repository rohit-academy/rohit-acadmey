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
   👤 GET LOGGED IN USER
===================================== */
router.get("/me", authMiddleware, getMe);

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

    /* 🔐 Send token to frontend */
    res.redirect(
      `${process.env.FRONTEND_URL}/success?token=${req.user.token}`
    );

  }
);

export default router;