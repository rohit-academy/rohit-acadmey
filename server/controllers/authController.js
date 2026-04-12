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
export const firebaseLogin = async (req, res, next) => {
  try {

    logger.info("🔥 FIREBASE LOGIN REQUEST RECEIVED");

    const { token } = req.body;

    if (!token) {
      logger.warn("❌ Firebase token missing");
      return res.status(400).json({
        success: false,
        message: "Firebase token required"
      });
    }

    /* =====================================
       VERIFY FIREBASE TOKEN
    ===================================== */

    let decoded;

    try {
      decoded = await admin.auth().verifyIdToken(token);
      logger.info("✅ Firebase token verified");
    } catch (err) {
      logger.error("❌ Firebase verify failed:", err);
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

    logger.info(`📧 Email: ${email}`);
    logger.info(`📱 Phone: ${phone}`);

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "No email or phone found in token"
      });
    }

    /* =====================================
       FIND EXISTING USER
    ===================================== */

    let user = await User.findOne({
      $or: [
        { firebaseId },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    /* =====================================
       UPDATE EXISTING USER
    ===================================== */

    if (user) {

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

      if (changed) {
        await user.save();
      }

      logger.info("✅ Existing user login");
    }

    /* =====================================
       EMAIL LINK
    ===================================== */

    if (!user && email) {

      const existingByEmail = await User.findOne({ email });

      if (existingByEmail) {

        user = existingByEmail;

        if (!user.firebaseId) {
          user.firebaseId = firebaseId;
        }

        user.lastLogin = new Date();
        user.authProvider = "firebase";
        user.isVerified = true;

        if (avatar && user.avatar !== avatar) {
          user.avatar = avatar;
        }

        await user.save();

        logger.info("🔗 Email account linked");
      }
    }

    /* =====================================
       CREATE NEW USER (FINAL FIX 🔥)
    ===================================== */

    if (!user) {

      logger.info("🆕 Creating new user");

      let username;
      let exists = true;
      let attempts = 0;

      while (exists) {

        username = "user_" + Math.random().toString(36).substring(2, 8);

        exists = await User.exists({ name: username });

        attempts++;

        if (attempts > 10) {
          username = "user_" + Date.now().toString().slice(-6);
          exists = false;
        }
      }

      logger.info(`Generated username: ${username}`);

      /* 🔥 SAFE CREATE OBJECT */
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

      logger.info("📦 Creating user with data:", newUserData);

      try {

        user = await User.create(newUserData);

        logger.info(`✅ New user created: ${user._id}`);

      } catch (err) {

        logger.error("❌ Create error:", err);

        /* 🔥 DUPLICATE SAFE RECOVERY */
        if (err.code === 11000) {

          logger.warn("⚠️ Duplicate detected, recovering user");

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
      logger.error("❌ User creation failed");
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
       GENERATE TOKEN
    ===================================== */

    const jwtToken = generateToken({
      id: user._id.toString(),
      role: user.role || "user"
    });

    logger.info(`🎉 LOGIN SUCCESS: ${user._id}`);

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user)
    });

  } catch (error) {

    logger.error("🔥 FIREBASE LOGIN CRASH:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};