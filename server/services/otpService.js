import { sendSMS } from "../config/sms.js";
import { generateOTP } from "../utils/otpGenerator.js";
import Otp from "../models/Otp.js";
import crypto from "crypto";

/* =====================================
   🔐 HASH OTP
===================================== */
const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

/* =====================================
   📲 CREATE & SEND OTP
===================================== */
export const createAndSendOTP = async (phone) => {

  try {

    /* 🔥 NORMALIZE PHONE */
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    /* ⏱ RATE LIMIT (30 sec cooldown) */
    const recentOtp = await Otp.findOne({
      phone: cleanPhone,
      createdAt: { $gt: new Date(Date.now() - 30 * 1000) }
    });

    if (recentOtp) {
      throw new Error("Please wait before requesting another OTP");
    }

    /* 🧹 DELETE OLD OTP */
    await Otp.deleteMany({ phone: cleanPhone });

    const otp = generateOTP();

    /* 🔐 HASHED OTP */
    const hashedOtp = hashOTP(otp);

    /* ⏳ EXPIRY (5 min) */
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      phone: cleanPhone,
      otp: hashedOtp,
      expiresAt
    });

    /* 📩 SEND SMS */
    const smsSent = await sendSMS(cleanPhone, { OTP: otp });

    if (!smsSent) {
      console.warn("⚠️ OTP saved but SMS delivery failed");
    }

    return true;

  } catch (error) {

    console.error("❌ OTP Error:", error.message);
    throw error;

  }
};