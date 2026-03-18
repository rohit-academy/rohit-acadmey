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

/* =====================================
   🌍 PUBLIC ROUTES
===================================== */

/* Only active materials visible to users */
router.get("/", getMaterials);
router.get("/:id", getMaterialById);

/* =====================================
   🛠 ADMIN ROUTES
===================================== */

/* ➕ CREATE MATERIAL (PDF + Thumbnail) */
router.post(
  "/",
  adminMiddleware,
  uploadPDF.fields([
    { name: "file", maxCount: 1 },        // 📄 PDF
    { name: "thumbnail", maxCount: 1 },   // 🖼 Thumbnail
  ]),
  addMaterial
);

/* ✏️ UPDATE MATERIAL (PDF + Thumbnail replace support) */
router.put(
  "/:id",
  adminMiddleware,
  uploadPDF.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
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