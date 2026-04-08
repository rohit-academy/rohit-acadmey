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
   🔥 FIREBASE LOGIN (FINAL PRODUCTION)
===================================== */
export const firebaseLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token required",
      });
    }

    /* 🔐 VERIFY TOKEN */
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (err) {
      console.error("❌ Firebase verify failed:", err.message);

      return res.status(401).json({
        success: false,
        message: "Invalid Firebase token",
      });
    }

    const email = decoded.email || null;
    const phone = decoded.phone_number
      ? decoded.phone_number.replace(/\D/g, "").slice(-10)
      : null;

    const firebaseId = decoded.uid;
    const avatar = decoded.picture || "";

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "No email or phone found in token",
      });
    }

    /* =====================================
       🔍 FIND USER (🔥 DUPLICATE SAFE FIX)
    ===================================== */
    let user = await User.findOne({
      $or: [
        { firebaseId },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    /* =====================================
       🔗 LINK / UPDATE EXISTING USER
    ===================================== */
    if (user) {
      user.firebaseId = firebaseId;
      user.authProvider = "firebase";
      user.isVerified = true;
      user.lastLogin = new Date();

      if (avatar) user.avatar = avatar;

      await user.save();
    }

    /* =====================================
       ➕ CREATE NEW USER
    ===================================== */
    if (!user) {
      user = await User.create({
        firebaseId,
        email,
        phone,
        avatar,
        authProvider: "firebase",
        isVerified: true,
        role: "user",
        name: "user" + Math.floor(Math.random() * 10000),
        lastLogin: new Date(),
      });

      logger.info(`🆕 New Firebase user: ${email || phone}`);
    }

    /* =====================================
       🚫 BLOCK CHECK
    ===================================== */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }

    /* =====================================
       🎟 JWT TOKEN (FINAL FIX)
    ===================================== */
    const jwtToken = generateToken({
      id: user._id.toString(),
      role: user.role || "user",
    });

    console.log("✅ LOGIN SUCCESS:", user._id);

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user),
    });

  } catch (error) {
    console.error("💥 FIREBASE LOGIN ERROR:", error);
    return next(error);
  }
};


/* =====================================
   👤 GET CURRENT USER
===================================== */
export const getMe = async (req, res, next) => {
  try {

    const user = await User.findById(req.user._id).lean();

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

    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    const user = await User.findById(req.user._id);

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
   🛠 ADMIN LOGIN (CONSISTENT FIX)
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
      message: "Invalid admin credentials",
    });

  } catch (error) {
    return next(error);
  }
};