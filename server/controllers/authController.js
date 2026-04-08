import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import admin from "../config/firebaseAdmin.js";

/* =====================================
   🔧 SAFE USER RESPONSE
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
   🔥 FIREBASE LOGIN
===================================== */
export const firebaseLogin = async (req, res, next) => {
  try {

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token required"
      });
    }

    /* =====================================
       🔐 VERIFY FIREBASE TOKEN
    ===================================== */

    let decoded;

    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (err) {

      logger.error("Firebase verify failed:", err.message);

      return res.status(401).json({
        success: false,
        message: "Invalid Firebase token"
      });
    }

    /* =====================================
       🔧 NORMALIZE DATA
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

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "No email or phone found in token"
      });
    }

    /* =====================================
       🔍 FIND EXISTING USER
    ===================================== */

    let user = await User.findOne({
      $or: [
        { firebaseId },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    /* =====================================
       🔗 UPDATE EXISTING USER
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

    }

    /* =====================================
       🔎 EMAIL BASED ACCOUNT LINK
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
      }

    }

    /* =====================================
       🆕 GENERATE UNIQUE USERNAME
    ===================================== */

    if (!user) {

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

        logger.info(`New Firebase user created: ${email || phone}`);

      } catch (err) {

        /* 🔥 DUPLICATE KEY SAFE FIX */
        if (err.code === 11000) {

          logger.warn("Duplicate user detected during creation");

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
       🚨 SAFETY CHECK
    ===================================== */

    if (!user) {
      logger.error("User creation failed unexpectedly");
      return res.status(500).json({
        success: false,
        message: "User creation failed"
      });
    }

    /* =====================================
       🚫 BLOCK CHECK
    ===================================== */

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* =====================================
       🎟 GENERATE JWT
    ===================================== */

    const jwtToken = generateToken({
      id: user._id.toString(),
      role: user.role || "user"
    });

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user)
    });

  } catch (error) {

    logger.error("Firebase login error:", error);

    return next(error);
  }
};


/* =====================================
   👤 GET CURRENT USER
===================================== */

export const getMe = async (req, res, next) => {
  try {

    const user = await User.findById(req.user._id)
      .select("_id name email phone avatar role authProvider")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: safeUser(user)
    });

  } catch (error) {
    return next(error);
  }
};


/* =====================================
   🆕 SET USERNAME
===================================== */

export const setUsername = async (req, res, next) => {
  try {

    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username required"
      });
    }

    name = name.trim().toLowerCase();

    if (!/^[a-z0-9_]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username format"
      });
    }

    if (name.length < 3 || name.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3–20 characters"
      });
    }

    const existing = await User.findOne({ name });

    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.name = name;

    await user.save();

    return res.json({
      success: true,
      user: safeUser(user)
    });

  } catch (error) {
    return next(error);
  }
};


/* =====================================
   🔐 ADMIN LOGIN
===================================== */

export const adminLogin = async (req, res, next) => {
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
        role: "admin",
        user: {
          id: "admin",
          email,
          role: "admin"
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials"
    });

  } catch (error) {
    return next(error);
  }
};