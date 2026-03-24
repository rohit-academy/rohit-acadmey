import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ========================================
   💳 PAYMENT ROUTES
======================================== */

/* 🔐 CREATE ORDER (user required) */
router.post("/create-order", protect, createOrder);

/* ✅ VERIFY PAYMENT (no protect - important) */
router.post("/verify", verifyPayment);

/* 🔔 OPTIONAL: WEBHOOK (future ready) */
// router.post("/webhook", razorpayWebhookHandler);

export default router;