import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Material from "../models/Material.js";

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
    const userId = req.user?.id;

    if (!materials?.length) {
      return res.status(400).json({
        success: false,
        message: "Materials required"
      });
    }

    /* 🔍 FETCH MATERIALS */
    const materialDocs = await Material.find({
      _id: { $in: materials },
      isActive: true
    });

    if (!materialDocs.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid materials"
      });
    }

    /* ❌ CHECK ALREADY PURCHASED */
    const existing = await Order.findOne({
      user: userId,
      materials: { $in: materials },
      status: "paid"
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already purchased this material"
      });
    }

    /* 💰 CALCULATE AMOUNT */
    const totalAmount = materialDocs.reduce(
      (sum, m) => sum + (m.price || 0),
      0
    );

    /* 🧾 CREATE RAZORPAY ORDER */
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    /* 💾 SAVE PENDING ORDER */
    await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      razorpay_order_id: razorpayOrder.id,
      status: "pending"
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
      razorpay_signature
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    /* 🔐 VERIFY SIGNATURE */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    /* 🔍 FIND ORDER */
    const order = await Order.findOne({
      razorpay_order_id,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    /* ❌ DUPLICATE PAYMENT CHECK */
    if (order.razorpay_payment_id) {
      return res.json({
        success: true,
        message: "Already verified",
        order
      });
    }

    /* ✅ UPDATE ORDER */
    order.razorpay_payment_id = razorpay_payment_id;
    order.status = "paid";
    order.paidAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Payment verified",
      order
    });

  } catch (error) {
    console.error("Verify Payment Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};