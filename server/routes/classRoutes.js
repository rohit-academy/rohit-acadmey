import express from "express";
import {
  addClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* Public */
router.get("/", getClasses);
router.get("/:id", getClassById);

/* Admin */
router.post("/", adminOnly, addClass);
router.put("/:id", adminOnly, updateClass);
router.delete("/:id", adminOnly, deleteClass);

export default router;