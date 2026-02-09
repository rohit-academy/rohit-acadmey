import express from "express";
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon
} from "../controllers/couponController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* USER */
router.post("/apply", protect, applyCoupon);

/* ADMIN */
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;
