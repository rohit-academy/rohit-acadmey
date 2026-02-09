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
import { upload } from "../middleware/uploadMiddleware.js"; // ⭐ FILE UPLOAD

const router = express.Router();

/* 🌍 PUBLIC ROUTES */
router.get("/", getMaterials);
router.get("/:id", getMaterialById);

/* 🛠 ADMIN ROUTES */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("file"), // ⭐ PDF FILE
  addMaterial
);

router.put("/:id", authMiddleware, adminMiddleware, updateMaterial);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMaterial);

export default router;
