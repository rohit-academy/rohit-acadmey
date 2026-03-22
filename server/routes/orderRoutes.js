import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyPurchases   // 🔥 ADD
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js"; // 🔥 ADD

const router = express.Router();

/* =====================================
   💳 CREATE ORDER
===================================== */
router.post("/create-order", createOrder);

/* =====================================
   ✅ VERIFY PAYMENT
===================================== */
router.post("/verify-payment", verifyPayment);

/* =====================================
   📥 GET USER PURCHASED MATERIALS (🔥 NEW)
===================================== */
router.get("/my-materials", authMiddleware, getMyPurchases);

export default router;