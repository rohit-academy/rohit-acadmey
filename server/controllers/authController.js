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
        isVerified: true
      });

      logger.info(`New user registered: ${phone}`);
    }

    /* 🚫 BLOCK CHECK */
    if (user.isBlocked) {
      logger.warn(`Blocked user login attempt: ${phone}`);
      return res.status(403).json({
        success: false,
        message: "Account blocked"
      });
    }

    /* 🔄 UPDATE LOGIN TIME */
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${phone}`);

    /* 🔐 TOKEN */
    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role
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
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    logger.error(`GetMe error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error"
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
      logger.warn("Admin logged in via credentials");

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

    logger.warn("Failed admin login attempt");

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