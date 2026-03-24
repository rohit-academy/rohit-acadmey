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

    /* 🔍 VALIDATE RELATION */
    const [cls, sub] = await Promise.all([
      Class.findById(classId),
      Subject.findById(subjectId)
    ]);

    if (!cls || !sub) throw new Error("Invalid class/subject");

    /* 🔥 UNIQUE TEMP PATH */
    const tempName = Date.now() + "-" + Math.random();
    const tempPdfPath = path.join("uploads", `${tempName}.pdf`);

    await fs.mkdir("uploads", { recursive: true });
    await fs.writeFile(tempPdfPath, pdfFile.buffer);

    /* PREVIEW */
    await generatePreview(tempPdfPath, "uploads");

    /* PDF UPLOAD */
    const pdf = await uploadPDFToCloudinary(pdfFile.buffer);

    /* PREVIEW UPLOAD */
    let previews = [];

    for (let i = 1; i <= 2; i++) {
      const file = `uploads/preview-${i}.jpg`;

      try {
        await fs.access(file);

        const res = await cloudinary.uploader.upload(file, {
          folder: "materials/previews"
        });

        previews.push(res.secure_url);

        await fs.unlink(file);
      } catch {}
    }

    /* THUMBNAIL */
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
   📄 GET MATERIALS
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
   ✏ UPDATE MATERIAL (SAFE)
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
   ❌ DELETE MATERIAL (FULL CLEAN)
===================================== */
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) throw new Error("Material not found");

    /* DELETE MAIN FILE */
    if (material.cloudinaryId) {
      await cloudinary.uploader.destroy(material.cloudinaryId, {
        resource_type: "raw"
      });
    }

    /* DELETE PREVIEWS */
    for (const url of material.previewImages || []) {
      const id = url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`materials/previews/${id}`);
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