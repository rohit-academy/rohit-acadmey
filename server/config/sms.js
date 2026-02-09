import axios from "axios";

/**
 * 📲 Send OTP SMS via MSG91
 */
export const sendSMS = async (phone, otp) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: `91${phone}`,
            OTP: otp
          }
        ]
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📩 OTP SMS sent to", phone);
    return true;

  } catch (error) {
    console.error("❌ SMS Error:", error.response?.data || error.message);

    // ❗ Important: OTP DB me save ho chuka hota hai
    // SMS fail hua to false return karo, server crash mat karo
    return false;
  }
};
