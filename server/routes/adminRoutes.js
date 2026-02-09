import express from "express";
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

/* 🔐 All admin routes protected */
router.use(protect, adminOnly);

/* 📊 Dashboard */
router.get("/stats", getAdminStats);

/* 👨‍🎓 USERS */
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/block", blockUser);       // ⭐ NEW
router.put("/users/:id/unblock", unblockUser);   // ⭐ NEW

/* 📦 ORDERS */
router.get("/orders", getAllOrders);

/* 📚 MATERIALS */
router.get("/materials", getAllMaterials);

export default router;
