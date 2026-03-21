import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

/* =====================================
   🔹 RAZORPAY INSTANCE
===================================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =====================================
   🧾 CREATE ORDER
===================================== */
export const createOrder = async (req, res) => {
  try {
    const { materials } = req.body;

    if (!materials || !materials.length) {
      return res.status(400).json({
        success: false,
        message: "Materials required"
      });
    }

    /* 🔍 FETCH MATERIALS */
    const materialDocs = await Material.find({
      _id: { $in: materials }
    });

    if (!materialDocs.length) {
      return res.status(400).json({
        success: false,
        message: "No valid materials found"
      });
    }

    /* 💰 CALCULATE AMOUNT (SECURE) */
    const totalAmount = materialDocs.reduce(
      (sum, m) => sum + (m.price || 0),
      0
    );

    /* 🧾 CREATE RAZORPAY ORDER */
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR"
    });

  } catch (error) {
    console.error("Create Order Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
};


/* =====================================
   🔐 VERIFY PAYMENT
===================================== */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      materials
    } = req.body;

    /* 🔐 USER FROM AUTH (🔥 IMPORTANT FIX) */
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    /* 🔐 SIGNATURE VERIFY */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    /* ❌ DUPLICATE CHECK */
    const existingOrder = await Order.findOne({
      paymentId: razorpay_payment_id
    });

    if (existingOrder) {
      return res.json({
        success: true,
        message: "Order already exists",
        order: existingOrder
      });
    }

    /* 🔍 FETCH MATERIALS AGAIN (SECURITY) */
    const materialDocs = await Material.find({
      _id: { $in: materials }
    });

    if (!materialDocs.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid materials"
      });
    }

    /* 💰 RE-CALCULATE AMOUNT */
    const totalAmount = materialDocs.reduce(
      (sum, m) => sum + (m.price || 0),
      0
    );

    /* ✅ CREATE ORDER */
    const newOrder = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "Paid"
    });

    /* 🔄 UPDATE USER LAST LOGIN (OPTIONAL) */
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date()
    });

    res.json({
      success: true,
      message: "Payment verified & order saved",
      order: newOrder
    });

  } catch (error) {
    console.error("Verify Payment Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};