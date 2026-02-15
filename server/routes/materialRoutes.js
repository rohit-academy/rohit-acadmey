import express from "express";
import {
  addMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";

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
  adminMiddleware,
  uploadPDF.single("file"), // 📄 PDF upload
  addMaterial
);

/* ✏️ UPDATE MATERIAL (PDF replace support) */
router.put(
  "/:id",
  adminMiddleware,
  uploadPDF.single("file"),
  updateMaterial
);

/* 🔁 TOGGLE ACTIVE / INACTIVE */
router.patch("/:id/toggle", adminMiddleware, async (req, res, next) => {
  try {
    const { default: Material } = await import("../models/Material.js");

    const material = await Material.findById(req.params.id);

    if (!material) {
      const err = new Error("Material not found");
      err.statusCode = 404;
      return next(err);
    }

    material.isActive = !material.isActive;
    await material.save();

    res.json({
      success: true,
      message: `Material ${
        material.isActive ? "activated" : "deactivated"
      }`,
      data: material,
    });
  } catch (error) {
    next(error);
  }
});

/* ❌ DELETE MATERIAL */
router.delete("/:id", adminMiddleware, deleteMaterial);

export default router;
