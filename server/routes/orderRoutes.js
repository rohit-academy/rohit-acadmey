import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyPurchases
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================
   🔐 PROTECTED ROUTES
===================================== */
router.use(authMiddleware);

/* 💳 CREATE ORDER (user required) */
router.post("/create-order", createOrder);

/* 📥 GET PURCHASES */
router.get("/my-materials", getMyPurchases);

/* =====================================
   🌐 PUBLIC / SPECIAL ROUTES
===================================== */

/* ✅ VERIFY PAYMENT (no auth for flexibility) */
router.post("/verify", verifyPayment);

/* 🔔 OPTIONAL WEBHOOK */
// router.post("/webhook", razorpayWebhook);

export default router;