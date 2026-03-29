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
  role: user.role,
  authProvider: user.authProvider,
});

/* =====================================
   🔥 FIREBASE LOGIN (FINAL STABLE)
===================================== */
export const firebaseLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    console.log("📥 Token:", token ? "YES" : "NO");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token required",
      });
    }

    /* 🔐 VERIFY TOKEN */
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token, true);
      console.log("✅ Firebase verified");
    } catch (err) {
      console.error("❌ Firebase verify failed:", err.message);

      return res.status(401).json({
        success: false,
        message: "Invalid Firebase token",
      });
    }

    /* 🔍 DATA */
    let email = decoded.email || null;
    let phone = decoded.phone_number || null;
    const firebaseId = decoded.uid;
    const avatar = decoded.picture || "";

    if (phone) {
      phone = phone.replace(/\D/g, "").slice(-10);
    }

    /* 🔍 FIND USER */
    let user = await User.findOne({ firebaseId });

    /* 🔗 LINK EMAIL */
    if (!user && email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log("🔗 Linking EMAIL");

        existingUser.firebaseId = firebaseId;
        existingUser.authProvider = "firebase";
        existingUser.avatar = avatar || existingUser.avatar;
        existingUser.isVerified = true;
        existingUser.lastLogin = new Date();

        await existingUser.save();     // ✅ FIX
        user = existingUser;
      }
    }

    /* 🔗 LINK PHONE */
    if (!user && phone) {
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        console.log("🔗 Linking PHONE");

        existingUser.firebaseId = firebaseId;
        existingUser.authProvider = "firebase";
        existingUser.isVerified = true;
        existingUser.lastLogin = new Date();

        await existingUser.save();     // ✅ FIX
        user = existingUser;
      }
    }

    /* ➕ CREATE USER */
    if (!user) {
      console.log("🆕 Creating user");

      user = await User.create({
        firebaseId,
        email,
        phone,
        avatar,
        authProvider: "firebase",
        isVerified: true,
        name: "user" + Math.floor(Math.random() * 10000),
        lastLogin: new Date(),
      });

      logger.info(`New Firebase user: ${email || phone}`);
    }

    /* 🚫 BLOCK */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }

    /* 🔄 UPDATE LOGIN (SAFE WAY) */
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    /* 🎟 JWT */
    const jwtToken = generateToken({
      id: user._id,
      role: user.role,
    });

    console.log("✅ LOGIN SUCCESS");

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user),
    });

  } catch (error) {
    console.error("💥 FIREBASE LOGIN ERROR:", error);

    return next(error); // ✅ correct error flow
  }
};

/* =====================================
   👤 GET CURRENT USER
===================================== */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: safeUser(user),
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
        message: "Username required",
      });
    }

    name = name.trim().toLowerCase();

    if (!/^[a-z0-9_]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username format",
      });
    }

    if (name.length < 3 || name.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3–20 characters",
      });
    }

    const existing = await User.findOne({ name });

    if (existing && existing._id.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name;
    await user.save();

    return res.json({
      success: true,
      user: safeUser(user),
    });

  } catch (error) {
    return next(error);
  }
};

/* =====================================
   🛠 ADMIN LOGIN
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
        role: "admin",
      });

      return res.json({
        success: true,
        admin: true,
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });

  } catch (error) {
    return next(error);
  }
};