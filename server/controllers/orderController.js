import crypto from "crypto";
// import Razorpay from "razorpay"; ❌ Disabled for now
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

/* ❌ Razorpay init disabled */
/*
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
*/


/* ===============================
   1️⃣ CREATE ORDER (TEMP MANUAL)
================================ */
export const createOrder = async (req, res) => {
  try {
    const { materials, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const materialDocs = await Material.find({ _id: { $in: materials } });

    if (materialDocs.length !== materials.length) {
      return res.status(400).json({ message: "Invalid materials selected" });
    }

    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    // ⚠️ Instead of Razorpay order, return fake order
    res.json({
      success: true,
      fakeOrder: true,
      amount: totalAmount,
      message: "Payment gateway not configured yet"
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ===============================
   2️⃣ VERIFY PAYMENT (BYPASS MODE)
================================ */
export const verifyPayment = async (req, res) => {
  try {
    const { userId, materials } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const materialDocs = await Material.find({ _id: { $in: materials } });

    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    // 🧾 Prevent duplicates
    const existingOrder = await Order.findOne({ user: userId, materials });
    if (existingOrder) {
      return res.json({ success: true, orderId: existingOrder._id });
    }

    const newOrder = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      paymentStatus: "Manual" // ⭐ Important
    });

    res.json({
      success: true,
      message: "Order created (manual mode)",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
