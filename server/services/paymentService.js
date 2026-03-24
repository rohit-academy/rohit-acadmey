import Razorpay from "razorpay";
import crypto from "crypto";

/* =====================================
   🔐 ENV CHECK
===================================== */
if (
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET
) {
  throw new Error("Razorpay keys missing in env");
}

/* =====================================
   🔹 INSTANCE
===================================== */
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =====================================
   🧾 CREATE ORDER
===================================== */
export const createRazorpayOrder = async (amount) => {
  try {

    /* ❌ VALIDATION */
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const options = {
      amount: Math.round(amount * 100), // 🔥 safe convert
      currency: "INR",
      receipt: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };

  } catch (error) {
    console.error("❌ Razorpay Order Error:", error.message);
    throw new Error("Failed to create order");
  }
};

/* =====================================
   ✅ VERIFY PAYMENT
===================================== */
export const verifyRazorpayPayment = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {

  try {

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return false;
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    /* 🔐 SAFE COMPARE */
    return crypto.timingSafeEqual(
      Buffer.from(expectedSign),
      Buffer.from(razorpay_signature)
    );

  } catch (error) {
    console.error("❌ Razorpay Verify Error:", error.message);
    return false;
  }
};