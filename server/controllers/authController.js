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
  authProvider: user.authProvider
});

/* =====================================
   🔥 FIREBASE LOGIN (DEBUG VERSION)
===================================== */
export const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    console.log("📥 Incoming token:", token ? "Present ✅" : "Missing ❌");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token required"
      });
    }

    console.log("🔥 Admin apps count:", admin.apps.length);

    /* 🔐 VERIFY FIREBASE TOKEN */
    let decoded;

    try {
      decoded = await admin.auth().verifyIdToken(token, true);
      console.log("✅ TOKEN VERIFIED");
      console.log("🧾 DECODED TOKEN:", decoded);
    } catch (err) {
      console.error("❌ TOKEN VERIFY FAILED:", err.message);

      return res.status(401).json({
        success: false,
        message: "Invalid Firebase token",
        debug: err.message
      });
    }

    /* 🔍 EXTRACT DATA */
    let email = decoded.email || null;
    let phone =
      decoded.phone_number ||
      decoded.phoneNumber ||
      decoded.firebase?.sign_in_provider === "phone"
        ? decoded.phone_number
        : null;

    const firebaseId = decoded.uid;
    const avatar = decoded.picture || "";

    console.log("👤 UID:", firebaseId);
    console.log("📧 Email:", email);
    console.log("📱 Phone:", phone);

    /* 📱 NORMALIZE PHONE */
    if (phone) {
      phone = phone.replace(/\D/g, "").slice(-10);
      console.log("📱 Normalized Phone:", phone);
    }

    /* 🔍 FIND USER BY FIREBASE ID */
    let user = await User.findOne({ firebaseId });
    console.log("🔍 User by firebaseId:", user ? "Found ✅" : "Not Found ❌");

    /* 🔗 LINK EXISTING USER (EMAIL) */
    if (!user && email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log("🔗 Linking with existing EMAIL user");

        existingUser.firebaseId = firebaseId;
        existingUser.authProvider = "firebase";
        existingUser.avatar = avatar || existingUser.avatar;
        existingUser.isVerified = true;
        existingUser.lastLogin = new Date();

        user = await existingUser.save();
      }
    }

    /* 🔗 LINK EXISTING USER (PHONE) */
    if (!user && phone) {
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        console.log("🔗 Linking with existing PHONE user");

        existingUser.firebaseId = firebaseId;
        existingUser.authProvider = "firebase";
        existingUser.isVerified = true;
        existingUser.lastLogin = new Date();

        user = await existingUser.save();
      }
    }

    /* ➕ CREATE NEW USER */
    if (!user) {
      console.log("🆕 Creating new user");

      user = await User.create({
        firebaseId,
        email,
        phone,
        avatar,
        authProvider: "firebase",
        isVerified: true,
        name: "user" + Math.floor(Math.random() * 10000),
        lastLogin: new Date()
      });

      logger.info(`New Firebase user created: ${email || phone}`);
    }

    /* 🚫 BLOCK CHECK */
    if (user.isBlocked) {
      console.log("⛔ Blocked user");

      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* 🔄 UPDATE LOGIN TIME */
    user.lastLogin = new Date();
    await user.save();

    console.log("🔄 Updated last login");

    /* 🎟 JWT TOKEN */
    const jwtToken = generateToken({
      id: user._id,
      role: user.role
    });

    console.log("🎟 JWT GENERATED");

    return res.json({
      success: true,
      token: jwtToken,
      user: safeUser(user)
    });

  } catch (error) {
    console.error("💥 FIREBASE LOGIN FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Firebase login failed",
      debug: error.message
    });
  }
};

/* =====================================
   👤 GET CURRENT USER
===================================== */
export const getMe = async (req, res) => {
  try {
    console.log("👤 GET ME:", req.user?.id);

    const user = await User.findById(req.user.id).lean();

    if (!user) {
      console.log("❌ User not found");

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
    console.error("💥 GET ME ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
};

/* =====================================
   🆕 SET USERNAME
===================================== */
export const setUsername = async (req, res) => {
  try {
    console.log("✏️ Set username request:", req.body);

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
        message: "Only lowercase letters, numbers & underscore allowed"
      });
    }

    if (name.length < 3 || name.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3–20 characters"
      });
    }

    const existing = await User.findOne({ name });

    if (existing && existing._id.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.name = name;
    await user.save();

    console.log("✅ Username updated:", name);

    return res.json({
      success: true,
      user: safeUser(user)
    });

  } catch (error) {
    console.error("💥 SET USERNAME ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update username"
    });
  }
};

/* =====================================
   🛠 ADMIN LOGIN
===================================== */
export const adminLogin = async (req, res) => {
  try {
    console.log("🔐 Admin login attempt:", req.body.email);

    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken({
        id: "admin",
        role: "admin"
      });

      console.log("✅ Admin login success");

      return res.json({
        success: true,
        admin: true,
        token
      });
    }

    console.log("❌ Invalid admin credentials");

    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials"
    });

  } catch (error) {
    console.error("💥 ADMIN LOGIN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};