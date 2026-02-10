import crypto from "crypto";
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

/* ======================================================
   🧾 VERIFY PAYMENT & CREATE ORDER (SECURE)
====================================================== */

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      materials,
    } = req.body;

    /* 🔍 1️⃣ Basic Validation */
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !materials?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment data",
      });
    }

    /* 🔐 2️⃣ Signature Verification */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    /* 👤 3️⃣ Validate User */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    /* 📦 4️⃣ Fetch Materials from DB */
    const materialDocs = await Material.find({ _id: { $in: materials } });

    if (materialDocs.length !== materials.length) {
      return res.status(400).json({
        success: false,
        message: "Some materials not found",
      });
    }

    /* 💰 5️⃣ Secure Server-Side Amount Calculation */
    const totalAmount = materialDocs.reduce(
      (sum, material) => sum + material.price,
      0
    );

    /* 🛑 6️⃣ Prevent Duplicate Orders */
    const existingOrder = await Order.findOne({ razorpay_payment_id });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        orderId: existingOrder._id,
      });
    }

    /* ✅ 7️⃣ Create Order */
    const newOrder = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      razorpay_order_id,
      razorpay_payment_id,
      paymentStatus: "Paid",
    });

    res.status(201).json({
      success: true,
      message: "Payment verified & order created",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};
