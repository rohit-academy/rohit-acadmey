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

/* 👉 STEP 1: REDIRECT TO GOOGLE */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account" // 🔥 better UX
  })
);

/* =====================================
   👉 STEP 2: CALLBACK
===================================== */
router.get("/google/callback", (req, res, next) => {

  passport.authenticate(
    "google",
    { session: false },
    (err, result) => {

      const FRONTEND_URL =
        process.env.FRONTEND_URL || "http://localhost:5173";

      /* ❌ ERROR */
      if (err) {
        console.error("❌ Passport Error:", err);
        return res.redirect(`${FRONTEND_URL}/login?error=google_failed`);
      }

      /* ❌ INVALID RESULT */
      if (!result || !result.user) {
        console.warn("❌ Invalid result:", result);
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }

      const { token, user } = result;

      /* ❌ TOKEN MISSING */
      if (!token) {
        console.warn("❌ Token missing:", result);
        return res.redirect(`${FRONTEND_URL}/login?error=no_token`);
      }

      console.log(`✅ Google login success: ${user.email}`);

      /* ✅ SUCCESS */
      return res.redirect(
        `${FRONTEND_URL}/login-success?token=${token}`
      );

    }
  )(req, res, next);

});

export default router;