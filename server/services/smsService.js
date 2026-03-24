import axios from "axios";

/* =====================================
   📲 SEND SMS (MSG91 FLOW API)
===================================== */
export const sendSMS = async (phone, variables = {}) => {
  try {

    /* ❌ ENV CHECK */
    if (
      !process.env.MSG91_AUTH_KEY ||
      !process.env.MSG91_TEMPLATE_ID
    ) {
      throw new Error("MSG91 env variables missing");
    }

    /* 🔥 NORMALIZE PHONE */
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const mobile = "91" + cleanPhone;

    /* 🔐 REQUEST BODY */
    const body = {
      template_id: process.env.MSG91_TEMPLATE_ID,
      short_url: "0", // optional
      recipients: [
        {
          mobiles: mobile,
          ...variables, // 🔥 dynamic template vars
        },
      ],
    };

    const response = await axios.post(
      "https://api.msg91.com/api/v5/flow/",
      body,
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
        timeout: 5000, // ⏱ safety
      }
    );

    console.log("📩 SMS Sent:", response.data);

    return true;

  } catch (error) {

    console.error(
      "❌ SMS Failed:",
      error.response?.data || error.message
    );

    return false;
  }
};