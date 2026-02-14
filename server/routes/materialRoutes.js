import express from "express";
import {
  addMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { uploadPDF } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* 🌍 PUBLIC ROUTES */
router.get("/", getMaterials);
router.get("/:id", getMaterialById);

/* 🛠 ADMIN ROUTES */

/* ➕ CREATE MATERIAL */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPDF.single("file"), // 🔥 PDF upload
  addMaterial
);

/* ✏️ UPDATE MATERIAL (PDF replace support) */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadPDF.single("file"), // 🔥 MUST for replacing PDF
  updateMaterial
);

/* ❌ DELETE MATERIAL */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMaterial
);

export default router;
