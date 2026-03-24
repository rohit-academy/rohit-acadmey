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

/* 👉 STEP 1: Redirect */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
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

      /* ❌ PASSPORT ERROR */
      if (err) {
        console.error("❌ Passport Error:", err);
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      /* ❌ NO RESULT */
      if (!result || !result.user) {
        console.warn("❌ Invalid passport result:", result);
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      const { token, user } = result;

      /* ❌ TOKEN CHECK */
      if (!token) {
        console.warn("❌ Token missing:", result);
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      console.log(`✅ Google login success: ${user.email}`);

      /* ✅ SUCCESS REDIRECT */
      return res.redirect(
        `${FRONTEND_URL}/success?token=${token}`
      );

    }
  )(req, res, next);

});

export default router;