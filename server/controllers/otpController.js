import Otp from "../models/Otp.js";
import { createAndSendOTP } from "../services/otpService.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

/* =====================================
   🔐 HASH FUNCTION
===================================== */
const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

/* =====================================
   📩 SEND OTP
===================================== */
export const sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;

    /* 🔥 NORMALIZE */
    phone = phone?.replace(/\D/g, "").slice(-10);

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Valid phone required"
      });
    }

    await createAndSendOTP(phone);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Send OTP error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "OTP send failed"
    });
  }
};

/* =====================================
   ✅ VERIFY OTP
===================================== */
export const verifyOtp = async (req, res) => {
  try {
    let { phone, otp } = req.body;

    /* 🔥 NORMALIZE */
    phone = phone?.replace(/\D/g, "").slice(-10);

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP required"
      });
    }

    const record = await Otp.findOne({ phone });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    /* ⛔ EXPIRED */
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    /* ⛔ ATTEMPTS */
    if (record.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts"
      });
    }

    /* 🔐 HASH COMPARE */
    if (record.otp !== hashOTP(otp)) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP"
      });
    }

    /* 👤 USER */
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        authProvider: "phone",
        isVerified: true,
        name: ""
      });
    }

    user.lastLogin = new Date();
    await user.save();

    /* 🔐 TOKEN */
    const token = generateToken({
      id: user._id,
      role: user.role
    });

    /* 🧹 DELETE OTP */
    await Otp.deleteOne({ _id: record._id });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        authProvider: user.authProvider
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error.message);

    res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};