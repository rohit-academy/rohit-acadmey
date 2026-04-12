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

    logger.info("🔥 FIREBASE LOGIN START");

    const { token } = req.body;

    if (!token) {
      logger.warn("❌ No token");
      return res.status(400).json({ success: false, message: "Token required" });
    }

    /* 🔐 VERIFY TOKEN */
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
      logger.info("✅ Firebase verified", decoded.uid);
    } catch (err) {
      logger.error("❌ Firebase verify error", err);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    /* 🔧 NORMALIZE */
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

    logger.info("📦 DATA:", { firebaseId, email, phone });

    /* 🔍 FIND USER */
    let user = await User.findOne({
      $or: [
        { firebaseId },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    /* 🔗 UPDATE USER */
    if (user) {
      logger.info("✅ Existing user found");

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

    /* 🔎 EMAIL LINK */
    if (!user && email) {
      const existing = await User.findOne({ email });

      if (existing) {
        logger.info("🔗 Linking email account");

        user = existing;
        user.firebaseId = firebaseId;
        user.lastLogin = new Date();
        user.authProvider = "firebase";
        user.isVerified = true;

        if (avatar) user.avatar = avatar;

        await user.save();
      }
    }

    /* 🆕 CREATE USER */
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
          break;
        }
      }

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

      try {
        user = await User.create(newUserData);
        logger.info("✅ User created:", user._id);

      } catch (err) {

        logger.error("❌ CREATE ERROR:", err);

        if (err.code === 11000) {

          logger.warn("⚠️ Duplicate - recovering");

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

    /* 🚨 FINAL CHECK */
    if (!user) {
      logger.error("❌ FINAL FAIL");
      return res.status(500).json({ success: false, message: "User creation failed" });
    }

    /* 🚫 BLOCK */
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "Blocked" });
    }

    /* 🎟 TOKEN */
    const jwtToken = generateToken({
      id: user._id.toString(),
      role: user.role || "user"
    });

    logger.info("🎉 LOGIN SUCCESS");

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user)
    });

  } catch (error) {

    logger.error("🔥 CRASH:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* =====================================
   ADMIN LOGIN (FIXED EXPORT)
===================================== */
export const adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {

      const token = generateToken({
        id: "admin",
        role: "admin"
      });

      return res.json({
        success: true,
        token,
        role: "admin"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};