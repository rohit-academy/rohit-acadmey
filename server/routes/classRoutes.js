import express from "express";
import {
  addClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* Public */
router.get("/", getClasses);
router.get("/:id", getClassById);

/* Admin */
router.post("/", protect, adminOnly, addClass);
router.put("/:id", protect, adminOnly, updateClass);
router.delete("/:id", protect, adminOnly, deleteClass);

export default router;
