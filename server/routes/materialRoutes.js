import express from "express";
import {
  uploadMaterialPDF,   // ⭐ new
  addMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* 🌍 PUBLIC */
router.get("/", getMaterials);
router.get("/:id", getMaterialById);

/* 📤 PDF UPLOAD (Admin) */
router.post(
  "/upload-pdf",
  authMiddleware,
  adminMiddleware,
  upload.single("pdf"),
  uploadMaterialPDF
);

/* 🛠 CREATE MATERIAL */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addMaterial
);

router.put("/:id", authMiddleware, adminMiddleware, updateMaterial);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMaterial);

export default router;
