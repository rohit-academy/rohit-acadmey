import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Material from "../models/Material.js";

/* =====================================
   🔹 RAZORPAY INSTANCE (SAFE)
===================================== */
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ Razorpay keys missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =====================================
   🧾 CREATE ORDER
===================================== */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { materials } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!Array.isArray(materials) || materials.length === 0) {
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

    if (materialDocs.length !== materials.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid materials"
      });
    }

    /* ❌ STRICT DUPLICATE CHECK */
    const purchased = await Order.find({
      user: userId,
      status: "paid"
    });

    const purchasedIds = new Set(
      purchased.flatMap(o => o.materials.map(id => id.toString()))
    );

    const alreadyOwned = materials.filter(id =>
      purchasedIds.has(id.toString())
    );

    if (alreadyOwned.length) {
      return res.status(400).json({
        success: false,
        message: "Some materials already purchased"
      });
    }

    /* 💰 CALCULATE TOTAL */
    const totalAmount = materialDocs.reduce(
      (sum, m) => sum + (m.price || 0),
      0
    );

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    /* 🧾 CREATE RAZORPAY ORDER */
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    /* 💾 SAVE ORDER (PENDING) */
    const order = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      razorpay_order_id: razorpayOrder.id,
      status: "pending",
    });

    return res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order._id
    });

  } catch (error) {
    console.error("💥 CREATE ORDER ERROR:", error);

    return res.status(500).json({
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
    const userId = req.user?.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment data missing"
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

    /* 🔁 ALREADY VERIFIED */
    if (order.status === "paid") {
      return res.json({
        success: true,
        message: "Already verified",
        order
      });
    }

    /* 🔐 EXTRA SAFETY: VERIFY AMOUNT */
    const materialDocs = await Material.find({
      _id: { $in: order.materials }
    });

    const actualAmount = materialDocs.reduce(
      (sum, m) => sum + (m.price || 0),
      0
    );

    if (actualAmount !== order.amount) {
      return res.status(400).json({
        success: false,
        message: "Amount mismatch"
      });
    }

    /* ✅ UPDATE ORDER */
    order.razorpay_payment_id = razorpay_payment_id;
    order.status = "paid";
    order.paidAt = new Date();

    await order.save();

    return res.json({
      success: true,
      message: "Payment verified",
      order
    });

  } catch (error) {
    console.error("💥 VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};