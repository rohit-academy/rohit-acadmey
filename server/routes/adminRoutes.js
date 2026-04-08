import express from "express";
import mongoose from "mongoose";

import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllOrders,
  getAllMaterials,
  toggleUserBlock
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { adminLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* =====================================
   🔍 OBJECT ID VALIDATION
===================================== */
const validateId = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    next();

  } catch (error) {
    console.error("ID validation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Validation failed"
    });
  }
};

/* =====================================
   🔍 PAGINATION VALIDATION (FIXED)
===================================== */
const validatePagination = (req, res, next) => {

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 20;

  if (page < 1) page = 1;
  if (limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  /* 🔥 SAFE ATTACH */
  req.pagination = { page, limit };

  next();
};

/* =====================================
   🔒 SECURITY LAYER
===================================== */
router.use(protect, adminOnly, adminLimiter);

/* 🔥 LOGGING */
router.use((req, res, next) => {
  console.warn(`⚠️ Admin route: ${req.method} ${req.originalUrl}`);
  next();
});

/* =====================================
   📊 DASHBOARD
===================================== */
router.get("/stats", getAdminStats);

/* =====================================
   👨‍🎓 USERS
===================================== */
router.get("/users", validatePagination, getAllUsers);

router.delete("/users/:id", validateId, deleteUser);

router.patch("/users/:id/toggle-block", validateId, toggleUserBlock);

/* =====================================
   📦 ORDERS
===================================== */
router.get("/orders", validatePagination, getAllOrders);

/* =====================================
   📚 MATERIALS
===================================== */
router.get("/materials", validatePagination, getAllMaterials);

export default router;