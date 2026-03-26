import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import fs from "fs/promises";
import path from "path";
import { generatePreview } from "../utils/pdfPreview.js";

/* =====================================
   ☁️ UPLOAD HELPERS
===================================== */
const uploadPDFToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "materials", resource_type: "raw" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

const uploadImageToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/* =====================================
   ➕ ADD MATERIAL
===================================== */
export const addMaterial = async (req, res, next) => {
  try {
    const { title, classId, subjectId, price, type } = req.body;

    const pdfFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!title || !classId || !subjectId || !price || !type) {
      throw new Error("Required fields missing");
    }

    if (price < 0) throw new Error("Invalid price");
    if (!pdfFile) throw new Error("PDF required");

    const [cls, sub] = await Promise.all([
      Class.findById(classId),
      Subject.findById(subjectId)
    ]);

    if (!cls || !sub) throw new Error("Invalid class/subject");

    const tempName = Date.now() + "-" + Math.random();
    const tempPdfPath = path.join("uploads", `${tempName}.pdf`);

    await fs.mkdir("uploads", { recursive: true });
    await fs.writeFile(tempPdfPath, pdfFile.buffer);

    await generatePreview(tempPdfPath, "uploads");

    const pdf = await uploadPDFToCloudinary(pdfFile.buffer);

    let previews = [];

    for (let i = 1; i <= 2; i++) {
      const file = `uploads/preview-${i}.jpg`;

      try {
        await fs.access(file);

        const resUpload = await cloudinary.uploader.upload(file, {
          folder: "materials/previews"
        });

        previews.push(resUpload.secure_url);
        await fs.unlink(file);

      } catch {}
    }

    let thumb = "";

    if (thumbnailFile) {
      const t = await uploadImageToCloudinary(
        thumbnailFile.buffer,
        "materials/thumbnails"
      );
      thumb = t.secure_url;
    }

    const material = await Material.create({
      title: title.trim(),
      classId,
      subjectId,
      type,
      price,
      fileUrl: pdf.secure_url,
      cloudinaryId: pdf.public_id,
      thumbnail: thumb,
      previewImages: previews
    });

    await fs.unlink(tempPdfPath);

    logger.info(`Material added: ${material.title}`);

    res.status(201).json({
      success: true,
      data: material
    });

  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};

/* =====================================
   📄 GET ALL MATERIALS
===================================== */
export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ isActive: true })
      .populate("classId", "name")
      .populate("subjectId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: materials });

  } catch (err) {
    next(err);
  }
};

/* =====================================
   🔍 GET SINGLE MATERIAL ✅ FIXED
===================================== */
export const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("classId", "name")
      .populate("subjectId", "name");

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found"
      });
    }

    res.json({
      success: true,
      data: material
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================
   ✏ UPDATE MATERIAL
===================================== */
export const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) throw new Error("Material not found");

    const { title, price, description, isActive } = req.body;

    if (title) material.title = title.trim();
    if (price !== undefined && price >= 0) material.price = price;
    if (description !== undefined) material.description = description;
    if (isActive !== undefined) material.isActive = isActive;

    await material.save();

    res.json({ success: true, data: material });

  } catch (err) {
    next(err);
  }
};

/* =====================================
   ❌ DELETE MATERIAL (FIXED)
===================================== */
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) throw new Error("Material not found");

    if (material.cloudinaryId) {
      await cloudinary.uploader.destroy(material.cloudinaryId, {
        resource_type: "raw"
      });
    }

    /* ✅ FIXED PREVIEW DELETE */
    for (const url of material.previewImages || []) {
      try {
        const publicId = url
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);

      } catch {}
    }

    await material.deleteOne();

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};

/* =====================================
   🔁 TOGGLE MATERIAL STATUS ✅ FIX
===================================== */
export const toggleMaterialStatus = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found"
      });
    }

    // 🔁 Toggle active/inactive
    material.isActive = !material.isActive;

    await material.save();

    res.json({
      success: true,
      message: `Material ${
        material.isActive ? "activated" : "disabled"
      }`,
      data: material
    });

  } catch (err) {
    next(err);
  }
};