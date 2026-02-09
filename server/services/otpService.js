import { sendSMS } from "../config/sms.js";
import { generateOTP } from "../utils/otpGenerator.js";
import Otp from "../models/Otp.js";

export const createAndSendOTP = async (phone) => {
  // 🧹 Purane OTP delete karo (1 hi valid hona chahiye)
  await Otp.deleteMany({ phone });

  const otp = generateOTP();

  // ⏳ Expire in 5 min
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({ phone, otp, expiresAt });

  const smsSent = await sendSMS(phone, otp);

  if (!smsSent) {
    console.log("⚠️ OTP saved but SMS delivery failed");
  }
};
