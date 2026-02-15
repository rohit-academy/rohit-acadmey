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
/* Only active materials visible to users */
router.get("/", getMaterials);
router.get("/:id", getMaterialById);

/* 🛠 ADMIN ROUTES */

/* ➕ CREATE MATERIAL */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPDF.single("file"), // 📄 PDF upload
  addMaterial
);

/* ✏️ UPDATE MATERIAL (PDF replace support) */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadPDF.single("file"), // 📄 Required for PDF replace
  updateMaterial
);

/* 🔁 TOGGLE ACTIVE / INACTIVE */
router.patch(
  "/:id/toggle",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const material = await (await import("../models/Material.js")).default.findById(req.params.id);

      if (!material) {
        const err = new Error("Material not found");
        err.statusCode = 404;
        return next(err);
      }

      material.isActive = !material.isActive;
      await material.save();

      res.json({
        success: true,
        message: `Material ${material.isActive ? "activated" : "deactivated"}`,
        data: material,
      });
    } catch (error) {
      next(error);
    }
  }
);

/* ❌ DELETE MATERIAL */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMaterial
);

export default router;
