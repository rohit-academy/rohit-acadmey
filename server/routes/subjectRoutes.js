import express from "express";
import {
  addSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subjectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ========================================
   📄 PUBLIC ROUTES
======================================== */

/* Get all subjects */
router.get("/", getSubjects);

/* 🔥 IMPORTANT: specific routes first (future safe) */
// router.get("/popular", getPopularSubjects);

/* Get single subject */
router.get("/:id", getSubjectById);


/* ========================================
   🔐 ADMIN ROUTES
======================================== */

/* 🔒 Apply middleware once (cleaner) */
router.use(protect, adminOnly);

/* Add subject */
router.post("/", addSubject);

/* Update subject */
router.put("/:id", updateSubject);

/* Delete subject */
router.delete("/:id", deleteSubject);


export default router;