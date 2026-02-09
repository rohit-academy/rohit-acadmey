import express from "express";
import {
  addSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* Public */
router.get("/", getSubjects);
router.get("/:id", getSubjectById);

/* Admin */
router.post("/", protect, adminOnly, addSubject);
router.put("/:id", protect, adminOnly, updateSubject);
router.delete("/:id", protect, adminOnly, deleteSubject);

export default router;
