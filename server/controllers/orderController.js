import Order from "../models/Order.js";
import Material from "../models/Material.js";

/* =====================================
   🧾 CREATE ORDER (SAFE MANUAL MODE)
===================================== */
export const createOrder = async (req, res) => {
  try {

    const userId = req.user?.id; // 🔥 FIX
    const { materials } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!materials?.length) {
      return res.status(400).json({
        success: false,
        message: "Materials required"
      });
    }

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

    /* ❌ ALREADY PURCHASED CHECK */
    const existing = await Order.findOne({
      user: userId,
      materials: { $in: materials },
      status: "paid"
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already purchased"
      });
    }

    const totalAmount = materialDocs.reduce(
      (sum, m) => sum + m.price,
      0
    );

    res.json({
      success: true,
      fakeOrder: true,
      amount: totalAmount
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =====================================
   ✅ VERIFY PAYMENT (MANUAL SAFE)
===================================== */
export const verifyPayment = async (req, res) => {
  try {

    const userId = req.user?.id; // 🔥 FIX
    const { materials } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

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

    const totalAmount = materialDocs.reduce(
      (sum, m) => sum + m.price,
      0
    );

    /* ❌ DUPLICATE CHECK */
    const existing = await Order.findOne({
      user: userId,
      materials: { $in: materials },
      status: "paid"
    });

    if (existing) {
      return res.json({
        success: true,
        orderId: existing._id
      });
    }

    /* ✅ CREATE ORDER */
    const newOrder = await Order.create({
      user: userId,
      materials,
      amount: totalAmount,
      status: "paid", // 🔥 FIXED
      paidAt: new Date()
    });

    res.json({
      success: true,
      message: "Order created (manual mode)",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =====================================
   📥 GET MY PURCHASES
===================================== */
export const getMyPurchases = async (req, res) => {
  try {

    const userId = req.user?.id;

    const orders = await Order.find({
      user: userId,
      status: "paid" // 🔥 FIX
    }).populate("materials");

    const materials = orders.flatMap(o => o.materials);

    res.json({
      success: true,
      data: materials
    });

  } catch (error) {
    console.error("GET PURCHASES ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchases"
    });
  }
};