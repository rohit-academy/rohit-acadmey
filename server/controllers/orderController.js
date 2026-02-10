import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

/* 🧾 INIT RAZORPAY */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



/* ===============================
   1️⃣ CREATE RAZORPAY ORDER
================================ */
export const createOrder = async (req, res) => {
  try {
    const { materials, userId } = req.body;

    /* Validate user */
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    /* Fetch materials */
    const materialDocs = await Material.find({ _id: { $in: materials } });

    if (materialDocs.length !== materials.length) {
      return res.status(400).json({ message: "Invalid materials selected" });
    }

    /* Calculate total */
    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    /* Razorpay order */
    const options = {
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ===============================
   2️⃣ VERIFY PAYMENT & SAVE ORDER
================================ */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      materials
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const materialDocs = await Material.find({ _id: { $in: materials } });

    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    const existingOrder = await Order.findOne({ razorpay_payment_id });
    if (existingOrder) {
      return res.json({ success: true, orderId: existingOrder._id });
    }

    const newOrder = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      razorpay_order_id,
      razorpay_payment_id,
      paymentStatus: "Paid"
    });

    res.json({
      success: true,
      message: "Payment verified & order created",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
