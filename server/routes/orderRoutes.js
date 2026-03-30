import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyPurchases
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================
   🔐 PROTECTED ROUTES (USER REQUIRED)
===================================== */

/* 💳 CREATE ORDER */
router.post("/create-order", authMiddleware, createOrder);

/* ✅ VERIFY PAYMENT (SECURED) */
router.post("/verify-payment", authMiddleware, verifyPayment);

/* 📥 GET MY PURCHASES */
router.get("/my-materials", authMiddleware, getMyPurchases);


/* =====================================
   🔔 OPTIONAL WEBHOOK (FUTURE USE)
===================================== */

/*
import { razorpayWebhook } from "../controllers/orderController.js";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);
*/


/* =====================================
   🛠 FUTURE ADMIN ROUTES (OPTIONAL)
===================================== */

/*
import { adminOnly } from "../middleware/adminMiddleware.js";

router.get("/all-orders", authMiddleware, adminOnly, getAllOrders);
router.patch("/:id/status", authMiddleware, adminOnly, updateOrderStatus);
*/

export default router;