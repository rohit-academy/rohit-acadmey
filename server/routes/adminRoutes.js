import express from "express";
import mongoose from "mongoose";

import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllOrders,
  getAllMaterials,
  toggleUserBlock // 🔥 NEW (single handler)
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =====================================
   🔍 OBJECT ID VALIDATION (REUSABLE)
===================================== */
const validateId = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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
   🔍 PAGINATION VALIDATION
===================================== */
const validatePagination = (req, res, next) => {

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 20;

  /* 🔥 SAFE LIMITS */
  if (page < 1) page = 1;
  if (limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  req.query.page = page;
  req.query.limit = limit;

  next();
};

/* =====================================
   🔒 ALL ADMIN ROUTES PROTECTED
===================================== */
router.use(protect, adminOnly);

/* =====================================
   📊 DASHBOARD
===================================== */
router.get("/stats", getAdminStats);

/* =====================================
   👨‍🎓 USERS
===================================== */

/* 📄 GET USERS */
router.get("/users", validatePagination, getAllUsers);

/* ❌ DELETE USER */
router.delete("/users/:id", validateId, deleteUser);

/* 🔁 BLOCK / UNBLOCK (SMART API) */
router.patch("/users/:id/toggle-block", validateId, toggleUserBlock);

/*
  🔥 REQUEST BODY:
  {
    action: "block" | "unblock"
  }
*/

/* =====================================
   📦 ORDERS
===================================== */
router.get("/orders", validatePagination, getAllOrders);

/* =====================================
   📚 MATERIALS
===================================== */
router.get("/materials", validatePagination, getAllMaterials);

export default router;