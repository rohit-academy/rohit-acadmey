import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import admin from "../config/firebaseAdmin.js";

/* =====================================
   SAFE USER RESPONSE
===================================== */
const safeUser = (user) => ({
  _id: user._id,
  phone: user.phone,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  role: user.role || "user",
  authProvider: user.authProvider,
});

/* =====================================
   FIREBASE LOGIN
===================================== */
export const firebaseLogin = async (req, res) => {
  try {

    logger.info("🔥 FIREBASE LOGIN REQUEST");

    const { token } = req.body;

    if (!token) {
      logger.warn("❌ No token");
      return res.status(400).json({
        success: false,
        message: "Firebase token required"
      });
    }

    /* =====================================
       VERIFY TOKEN
    ===================================== */
    let decoded;

    try {
      decoded = await admin.auth().verifyIdToken(token);
      logger.info("✅ Token verified", decoded.uid);
    } catch (err) {
      logger.error("❌ Token verify failed", err);
      return res.status(401).json({
        success: false,
        message: "Invalid Firebase token"
      });
    }

    /* =====================================
       NORMALIZE DATA
    ===================================== */

    const firebaseId = decoded.uid;

    const email = decoded.email
      ? decoded.email.toLowerCase().trim()
      : null;

    let phone = null;

    if (decoded.phone_number) {
      const cleaned = decoded.phone_number.replace(/\D/g, "");
      phone = cleaned.length >= 10 ? cleaned.slice(-10) : null;
    }

    const avatar = decoded.picture || "";

    logger.info("Parsed:", { email, phone, firebaseId });

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "No email or phone found"
      });
    }

    /* =====================================
       FIND USER
    ===================================== */

    let user = await User.findOne({
      $or: [
        { firebaseId },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    /* =====================================
       UPDATE USER
    ===================================== */

    if (user) {

      logger.info("✅ Existing user", user._id);

      let changed = false;

      if (!user.firebaseId) {
        user.firebaseId = firebaseId;
        changed = true;
      }

      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        changed = true;
      }

      user.lastLogin = new Date();
      user.authProvider = "firebase";
      user.isVerified = true;

      if (changed) await user.save();
    }

    /* =====================================
       EMAIL LINK
    ===================================== */

    if (!user && email) {

      const existing = await User.findOne({ email });

      if (existing) {

        logger.info("🔗 Linking email user");

        user = existing;

        if (!user.firebaseId) {
          user.firebaseId = firebaseId;
        }

        user.lastLogin = new Date();
        user.authProvider = "firebase";
        user.isVerified = true;

        if (avatar) user.avatar = avatar;

        await user.save();
      }
    }

    /* =====================================
       CREATE USER (FINAL FIX)
    ===================================== */

    if (!user) {

      logger.info("🆕 Creating new user");

      let username;
      let exists = true;

      while (exists) {
        username = "user_" + Math.random().toString(36).slice(2, 8);
        exists = await User.exists({ name: username });
      }

      logger.info("Generated username:", username);

      try {

        /* 🔥 SMART CREATE (MAIN FIX) */
        const newUserData = {
          firebaseId,
          avatar,
          authProvider: "firebase",
          role: "user",
          isVerified: true,
          name: username,
          lastLogin: new Date()
        };

        if (email) newUserData.email = email;
        if (phone) newUserData.phone = phone;

        logger.info("🔥 Creating user:", newUserData);

        user = await User.create(newUserData);

        logger.info("✅ User created:", user._id);

      } catch (err) {

        logger.error("❌ CREATE ERROR:", err);

        if (err.code === 11000) {

          logger.warn("⚠️ Duplicate detected, recovering");

          user = await User.findOne({
            $or: [
              { firebaseId },
              ...(email ? [{ email }] : []),
              ...(phone ? [{ phone }] : [])
            ]
          });

        } else {
          throw err;
        }
      }
    }

    /* =====================================
       SAFETY CHECK
    ===================================== */

    if (!user) {
      logger.error("❌ FINAL USER NULL");
      return res.status(500).json({
        success: false,
        message: "User creation failed"
      });
    }

    /* =====================================
       BLOCK CHECK
    ===================================== */

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* =====================================
       TOKEN
    ===================================== */

    const jwtToken = generateToken({
      id: user._id.toString(),
      role: user.role
    });

    logger.info("✅ LOGIN SUCCESS");

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user)
    });

  } catch (error) {

    logger.error("🔥 FINAL CRASH:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};