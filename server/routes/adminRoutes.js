import express from "express";
import mongoose from "mongoose";

import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllOrders,
  getAllMaterials,
  blockUser,
  unblockUser
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =====================================
   🔍 ID VALIDATION
===================================== */
const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID"
    });
  }
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
router.get("/users", getAllUsers);

router.delete("/users/:id", validateId, deleteUser);

router.put("/users/:id/block", validateId, blockUser);
router.put("/users/:id/unblock", validateId, unblockUser);

/* =====================================
   📦 ORDERS
===================================== */
router.get("/orders", getAllOrders);

/* =====================================
   📚 MATERIALS
===================================== */
router.get("/materials", getAllMaterials);

export default router;