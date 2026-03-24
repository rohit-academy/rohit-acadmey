import axios from "axios";

/* =====================================
   📲 SEND OTP SMS (MSG91)
===================================== */
export const sendSMS = async (phone, otp) => {

  try {

    /* =====================================
       🔒 ENV VALIDATION
    ===================================== */
    if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_TEMPLATE_ID) {
      console.error("❌ MSG91 env missing");
      return false;
    }

    /* =====================================
       📱 CLEAN PHONE
    ===================================== */
    let cleanPhone = phone.toString().replace(/\D/g, "");

    // remove starting 91 if already present
    if (cleanPhone.startsWith("91") && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10);
    }

    const fullPhone = `91${cleanPhone}`;

    /* =====================================
       📡 API CALL
    ===================================== */
    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: fullPhone,
            OTP: otp
          }
        ]
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        },
        timeout: 8000 // 🔥 prevent hanging
      }
    );

    /* =====================================
       ✅ SUCCESS CHECK
    ===================================== */
    if (response.data?.type === "success") {
      console.log(`📩 OTP sent to ${fullPhone}`);
      return true;
    }

    console.warn("⚠️ MSG91 responded but not success:", response.data);
    return false;

  } catch (error) {

    console.error(
      "❌ SMS Error:",
      error.response?.data || error.message
    );

    /* ❗ IMPORTANT: fail safe */
    return false;

  }

};