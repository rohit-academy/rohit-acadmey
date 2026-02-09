import crypto from "crypto";
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      materials // array of material IDs
    } = req.body;

    /* 🔐 1️⃣ Signature Verify */
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    /* 👤 2️⃣ Validate User Exists */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* 📦 3️⃣ Fetch Materials from DB */
    const materialDocs = await Material.find({ _id: { $in: materials } });

    if (materialDocs.length !== materials.length) {
      return res.status(400).json({ message: "Invalid materials selected" });
    }

    /* 💰 4️⃣ Calculate Total on Server (Never trust frontend amount) */
    const totalAmount = materialDocs.reduce((sum, m) => sum + m.price, 0);

    /* 🧾 5️⃣ Prevent Duplicate Orders */
    const existingOrder = await Order.findOne({ razorpay_payment_id });
    if (existingOrder) {
      return res.json({ success: true, orderId: existingOrder._id });
    }

    /* ✅ 6️⃣ CREATE ORDER */
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
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
