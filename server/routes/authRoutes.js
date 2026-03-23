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

/* =====================================
   👉 STEP 2: Google Callback (🔥 FINAL)
===================================== */
router.get("/google/callback", (req, res, next) => {

  passport.authenticate(
    "google",
    {
      session: false
    },
    (err, result) => {

      console.log("🔥 GOOGLE CALLBACK RESULT:", result);

      /* ❌ ERROR FROM PASSPORT */
      if (err) {
        console.error("❌ Passport Error:", err);
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      /* ❌ NO RESULT */
      if (!result) {
        console.warn("❌ No result from passport");
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      const token = result?.token;

      /* ❌ TOKEN MISSING */
      if (!token) {
        console.warn("❌ Token missing in result:", result);
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      /* ✅ SUCCESS */
      console.log("✅ Login success, redirecting...");

      return res.redirect(
        `${process.env.FRONTEND_URL}/success?token=${token}`
      );

    }
  )(req, res, next);

});

export default router;