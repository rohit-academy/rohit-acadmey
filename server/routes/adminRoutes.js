import express from "express";
import {
  adminLogin,
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

/* 🔐 ADMIN LOGIN (PUBLIC) */
router.post("/login", adminLogin);

/* 🔒 PROTECT ALL BELOW ROUTES */
router.use(protect, adminOnly);

/* 📊 DASHBOARD */
router.get("/stats", getAdminStats);

/* 👨‍🎓 USERS */
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);

/* 📦 ORDERS */
router.get("/orders", getAllOrders);

/* 📚 MATERIALS */
router.get("/materials", getAllMaterials);

export default router;
