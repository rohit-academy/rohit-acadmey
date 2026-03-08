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

/* Get single subject */
router.get("/:id", getSubjectById);


/* ========================================
   🔐 ADMIN ROUTES
======================================== */

/* Add subject */
router.post("/", protect, adminOnly, addSubject);

/* Update subject */
router.put("/:id", protect, adminOnly, updateSubject);

/* Delete subject */
router.delete("/:id", protect, adminOnly, deleteSubject);


export default router;