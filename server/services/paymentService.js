import Razorpay from "razorpay";
import crypto from "crypto";

/* 🔹 Razorpay Instance */
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* 🧾 Create Order */
export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // ₹ to paise
    currency: "INR",
    receipt: "order_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
};

/* ✅ Verify Payment Signature */
export const verifyRazorpayPayment = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  return expectedSign === razorpay_signature;
};
