import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";

/* 📲 LOGIN / REGISTER AFTER OTP VERIFY */
export const loginWithPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    let user = await User.findOne({ phone });

    // 🆕 Create new user if not exists
    if (!user) {
      user = await User.create({ phone });
      logger.info(`New user registered: ${phone}`);
    }

    // 🚫 Blocked user check
    if (user.isBlocked) {
      logger.warn(`Blocked user login attempt: ${phone}`);
      return res.status(403).json({ message: "Account blocked" });
    }

    // 🔄 Update last login
    await user.updateLoginTime();

    logger.info(`User logged in: ${phone}`);

    res.json({
      _id: user._id,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* 👤 GET LOGGED IN USER */
export const getMe = async (req, res) => {
  res.json(req.user);
};


/* 🛠 ADMIN LOGIN (OPTIONAL BACKDOOR) */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      logger.warn("Admin logged in via credentials");

      res.json({
        admin: true,
        token: generateToken("admin")
      });
    } else {
      logger.warn("Failed admin login attempt");
      res.status(401).json({ message: "Invalid admin credentials" });
    }

  } catch (error) {
    logger.error(`Admin login error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
