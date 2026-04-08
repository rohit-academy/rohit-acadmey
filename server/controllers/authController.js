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

    logger.info("✅ Token received");

    /* =====================================
       VERIFY FIREBASE TOKEN
    ===================================== */

    let decoded;

    try {
      decoded = await admin.auth().verifyIdToken(token);
      logger.info("✅ Firebase token verified");
      logger.info(`Firebase UID: ${decoded.uid}`);
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

    logger.info(`Parsed Email: ${email}`);
    logger.info(`Parsed Phone: ${phone}`);

    if (!email && !phone) {
      logger.warn("❌ No email or phone found in Firebase token");

      return res.status(400).json({
        success: false,
        message: "No email or phone found in token"
      });
    }

    /* =====================================
       FIND EXISTING USER
    ===================================== */

    logger.info("🔍 Searching user in database");

    let user = await User.findOne({
      $or: [
        { firebaseId },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (user) {
      logger.info(`✅ Existing user found: ${user._id}`);
    } else {
      logger.info("⚠️ No user found in DB");
    }

    /* =====================================
       UPDATE EXISTING USER
    ===================================== */

    if (user) {

      logger.info("🔄 Updating existing user");

      let changed = false;

      if (!user.firebaseId) {
        logger.info("Linking firebaseId");
        user.firebaseId = firebaseId;
        changed = true;
      }

      if (avatar && user.avatar !== avatar) {
        logger.info("Updating avatar");
        user.avatar = avatar;
        changed = true;
      }

      user.lastLogin = new Date();
      user.authProvider = "firebase";
      user.isVerified = true;

      if (changed) {
        await user.save();
        logger.info("✅ User updated in DB");
      }

    }

    /* =====================================
       EMAIL ACCOUNT LINK
    ===================================== */

    if (!user && email) {

      logger.info("🔎 Searching user by email");

      const existingByEmail = await User.findOne({ email });

      if (existingByEmail) {

        logger.info(`🔗 Linking firebase to existing email user: ${existingByEmail._id}`);

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

        logger.info("✅ Email account linked with Firebase");
      }

    }

    /* =====================================
       CREATE NEW USER
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

      try {

        user = await User.create({
          firebaseId,
          email,
          phone,
          avatar,
          authProvider: "firebase",
          role: "user",
          isVerified: true,
          name: username,
          lastLogin: new Date()
        });

        logger.info(`✅ New Firebase user created: ${user._id}`);

      } catch (err) {

        logger.error("❌ User creation failed:", err);

        if (err.code === 11000) {

          logger.warn("⚠️ Duplicate key error, trying to recover");

          user = await User.findOne({
            $or: [
              { firebaseId },
              ...(email ? [{ email }] : []),
              ...(phone ? [{ phone }] : [])
            ]
          });

          logger.info("Recovered duplicate user");

        } else {
          throw err;
        }

      }

    }

    /* =====================================
       SAFETY CHECK
    ===================================== */

    if (!user) {

      logger.error("❌ User creation failed unexpectedly");

      return res.status(500).json({
        success: false,
        message: "User creation failed"
      });
    }

    /* =====================================
       BLOCK CHECK
    ===================================== */

    if (user.isBlocked) {

      logger.warn(`🚫 Blocked user tried login: ${user._id}`);

      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* =====================================
       GENERATE JWT
    ===================================== */

    logger.info("🎟 Generating JWT token");

    const jwtToken = generateToken({
      id: user._id.toString(),
      role: user.role || "user"
    });

    logger.info(`✅ Login success for user ${user._id}`);

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