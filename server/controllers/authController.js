import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import admin from "../config/firebaseAdmin.js";

/* =====================================
   🔧 HELPER: SAFE USER RESPONSE
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
   🔥 FIREBASE LOGIN (GOOGLE + OTP)
===================================== */
export const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token required"
      });
    }

    /* 🔐 VERIFY TOKEN */
    const decoded = await admin.auth().verifyIdToken(token);

    const email = decoded.email || null;
    const phone = decoded.phone_number || null;
    const firebaseId = decoded.uid;
    const avatar = decoded.picture || "";

    /* 🔍 FIND USER */
    let user = await User.findOne({ firebaseId });

    /* 🔗 LINK EXISTING USER */
    if (!user && email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        existingUser.firebaseId = firebaseId;
        existingUser.authProvider = "firebase";
        existingUser.avatar = avatar || existingUser.avatar;
        existingUser.isVerified = true;
        existingUser.lastLogin = new Date();

        user = await existingUser.save();
      }
    }

    /* ➕ CREATE NEW USER */
    if (!user) {
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
      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* 🔄 UPDATE LOGIN TIME */
    user.lastLogin = new Date();
    await user.save();

    /* 🎟 JWT */
    const jwt = generateToken({
      id: user._id,
      role: user.role
    });

    res.json({
      success: true,
      token: jwt,
      user: safeUser(user)
    });

  } catch (error) {
    console.error("Firebase login error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid Firebase token"
    });
  }
};

/* =====================================
   📲 (OLD) PHONE LOGIN (OPTIONAL)
===================================== */
export const loginWithPhone = async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required"
      });
    }

    phone = phone.replace(/\D/g, "").slice(-10);

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        authProvider: "phone",
        isVerified: true,
        name: ""
      });

      logger.info(`New user registered: ${phone}`);
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.json({
      success: true,
      user: safeUser(user),
      token
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =====================================
   👤 GET CURRENT USER
===================================== */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: safeUser(user)
    });

  } catch (error) {
    logger.error(`GetMe error: ${error.message}`);

    res.status(500).json({
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

    logger.info(`Username set: ${name}`);

    res.json({
      success: true,
      user: safeUser(user)
    });

  } catch (error) {
    logger.error(`Set username error: ${error.message}`);

    res.status(500).json({
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
        admin: true,
        token
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid admin credentials"
    });

  } catch (error) {
    logger.error(`Admin login error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};