import Otp from "../models/Otp.js";
import { createAndSendOTP } from "../services/otpService.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* 📩 SEND OTP */
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ message: "Valid phone required" });

    /* ⛔ Prevent OTP spam (1 min cooldown) */
    const recent = await Otp.findOne({ phone }).sort({ createdAt: -1 });

    if (recent && Date.now() - recent.createdAt < 60000) {
      return res.status(429).json({ message: "Wait 1 minute before requesting again" });
    }

    await createAndSendOTP(phone);

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP send failed" });
  }
};


/* ✅ VERIFY OTP */
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await Otp.findOne({ phone }).sort({ createdAt: -1 });

    if (!record)
      return res.status(400).json({ message: "Invalid OTP" });

    /* ⛔ Expired */
    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ phone });
      return res.status(400).json({ message: "OTP expired" });
    }

    /* ⛔ Too many attempts */
    if (record.attempts >= 5) {
      return res.status(429).json({ message: "Too many attempts. Try again later." });
    }

    /* ❌ Wrong OTP */
    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    /* 👤 USER CREATE / FIND */
    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    /* 🧹 Clean used OTP */
    await Otp.deleteMany({ phone });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
