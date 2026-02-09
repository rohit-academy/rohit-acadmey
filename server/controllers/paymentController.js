import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Material from "../models/Material.js";

/* 🔹 Razorpay Instance */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* 🧾 CREATE RAZORPAY ORDER */
export const createOrder = async (req, res) => {
  try {
    const { materials } = req.body; // array of material IDs

    /* 🔍 Fetch materials & calculate total securely */
    const materialDocs = await Material.find({ _id: { $in: materials } });

    if (!materialDocs.length)
      return res.status(400).json({ message: "No valid materials found" });

    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    const options = {
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};


/* 🔐 VERIFY PAYMENT */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      materials
    } = req.body;

    /* 🔐 Signature Verify */
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    /* ❌ Prevent duplicate orders */
    const existing = await Order.findOne({ paymentId: razorpay_payment_id });
    if (existing) {
      return res.json({ success: true, message: "Order already exists", order: existing });
    }

    /* 💰 Recalculate amount from DB (security) */
    const materialDocs = await Material.find({ _id: { $in: materials } });
    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    /* ✅ Create Order */
    const newOrder = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "Paid",
    });

    res.json({
      success: true,
      message: "Payment verified & order saved",
      order: newOrder
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
