import express from "express";
import {
  createOrder,
  verifyPayment
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ========================================
   💳 PAYMENT ROUTES
======================================== */

/* 🔐 CREATE ORDER */
router.post("/create-order", protect, createOrder);

/* 🔐 VERIFY PAYMENT (SECURE) */
router.post("/verify-payment", protect, verifyPayment);


/* ========================================
   🔔 OPTIONAL WEBHOOK (FUTURE READY)
======================================== */

/*
import { razorpayWebhookHandler } from "../controllers/paymentController.js";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhookHandler
);
*/


/* ========================================
   🛠 HEALTH CHECK (DEBUG)
======================================== */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes working 🚀"
  });
});

export default router;