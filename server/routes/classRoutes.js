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

/* =====================================
   🌍 PUBLIC ROUTES
===================================== */
router.get("/", getClasses);

// future safe (if you add /popular etc)
// router.get("/popular", getPopularClasses);

router.get("/:id", getClassById);

/* =====================================
   🔐 ADMIN ROUTES
===================================== */
router.use(protect, adminOnly);

router.post("/", addClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

export default router;