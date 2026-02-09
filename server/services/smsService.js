import axios from "axios";

export const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/flow/",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        sender: process.env.MSG91_SENDER_ID,
        mobiles: "91" + phone,
        message: message
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📩 SMS Sent:", response.data);
    return true;

  } catch (error) {
    console.error("❌ SMS Failed:", error.response?.data || error.message);
    return false;
  }
};
