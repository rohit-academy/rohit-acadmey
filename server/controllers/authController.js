import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";

/* =====================================
   📲 LOGIN / REGISTER WITH PHONE
===================================== */
export const loginWithPhone = async (req, res) => {
  try {

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required"
      });
    }

    let user = await User.findOne({ phone });

    /* 🆕 CREATE USER */
    if (!user) {
      user = await User.create({
        phone,
        authProvider: "phone",
        isVerified: true,
        name: "" // 🔥 keep empty (same flow as Google)
      });

      logger.info(`New user registered: ${phone}`);
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

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        authProvider: user.authProvider
      },
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

    const user = await User.findById(req.user.id).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
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
   🔵 GOOGLE LOGIN SUCCESS (🔥 FIXED)
===================================== */
export const googleLoginSuccess = async (req, res) => {

  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed"
      });
    }

    /* 🔥 FORCE EMPTY USERNAME */
    if (!user.name || user.name.includes(" ")) {
      user.name = ""; // 👉 IMPORTANT FIX
    }

    /* 🔄 UPDATE LOGIN TIME */
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    logger.info(`Google login success: ${user.email}`);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name, // now empty
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        authProvider: user.authProvider
      }
    });

  } catch (error) {

    logger.error(`Google login error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Google login failed"
    });

  }

};


/* =====================================
   🆕 SET USERNAME
===================================== */
export const setUsername = async (req, res) => {

  try {

    let { name } = req.body;

    /* ❌ EMPTY */
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username required"
      });
    }

    name = name.trim().toLowerCase();

    /* ❌ FORMAT CHECK */
    if (!/^[a-z0-9_]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only lowercase letters, numbers & underscore allowed"
      });
    }

    /* ❌ LENGTH */
    if (name.length < 3 || name.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3–20 characters"
      });
    }

    /* ❌ DUPLICATE */
    const existing = await User.findOne({ name });

    if (existing && existing._id.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }

    /* ✅ UPDATE */
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
      data: user
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