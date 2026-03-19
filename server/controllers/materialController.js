import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import fs from "fs";
import path from "path";
import { generatePreview } from "../utils/pdfPreview.js";

/* ☁️ Upload PDF */
const uploadPDFToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "materials",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);

  });

/* 🖼 Upload Image */
const uploadImageToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);

  });

/* ➕ ADD MATERIAL */
export const addMaterial = async (req, res, next) => {

  try {

    const {
      title,
      classId,
      subjectId,
      price,
      description,
      type,
      pages
    } = req.body;

    const pdfFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!title || !classId || !subjectId || !price || !type) {
      return next(new Error("Required fields missing"));
    }

    if (!pdfFile) {
      return next(new Error("PDF file is required"));
    }

    const isPDF =
      pdfFile.mimetype === "application/pdf" ||
      pdfFile.originalname.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return next(new Error("Only PDF files are allowed"));
    }

    if (pdfFile.size > 10 * 1024 * 1024) {
      return next(new Error("File size must be under 10MB"));
    }

    const classExists = await Class.findById(classId);
    const subjectExists = await Subject.findById(subjectId);

    if (!classExists || !subjectExists) {
      return next(new Error("Invalid class or subject"));
    }

    /* TEMP FILE */
    const uploadsDir = path.join("uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const tempPdfPath = `uploads/${Date.now()}.pdf`;
    fs.writeFileSync(tempPdfPath, pdfFile.buffer);

    /* PREVIEW GENERATE */
    await generatePreview(tempPdfPath, "uploads");

    /* PDF UPLOAD */
    const pdfResult = await uploadPDFToCloudinary(pdfFile.buffer);

    /* ✅ SAFE PREVIEW UPLOAD */
    let previewImages = [];

    try {

      if (fs.existsSync("uploads/preview-1.jpg")) {
        const p1 = await cloudinary.uploader.upload(
          "uploads/preview-1.jpg",
          { folder: "materials/previews" }
        );
        previewImages.push(p1.secure_url);
      }

      if (fs.existsSync("uploads/preview-2.jpg")) {
        const p2 = await cloudinary.uploader.upload(
          "uploads/preview-2.jpg",
          { folder: "materials/previews" }
        );
        previewImages.push(p2.secure_url);
      }

    } catch (err) {
      console.log("Preview upload error:", err.message);
    }

    /* THUMBNAIL */
    let thumbnailUrl = "";

    if (thumbnailFile) {
      const thumbResult = await uploadImageToCloudinary(
        thumbnailFile.buffer,
        "materials/thumbnails"
      );
      thumbnailUrl = thumbResult.secure_url;
    }

    /* SAVE */
    const material = await Material.create({

      title: title.trim(),
      description: description?.trim() || "",
      classId,
      subjectId,
      type,
      pages: pages || 0,
      price,

      fileUrl: pdfResult.secure_url,
      cloudinaryId: pdfResult.public_id,

      thumbnail: thumbnailUrl,

      previewImages

    });

    /* CLEANUP SAFE */
    fs.unlinkSync(tempPdfPath);

    if (fs.existsSync("uploads/preview-1.jpg"))
      fs.unlinkSync("uploads/preview-1.jpg");

    if (fs.existsSync("uploads/preview-2.jpg"))
      fs.unlinkSync("uploads/preview-2.jpg");

    logger.info(`Material added: ${material.title}`);

    res.status(201).json({
      success: true,
      message: "Material added successfully",
      data: material
    });

  } catch (error) {

    logger.error(`Add material error: ${error.message}`);
    next(error);

  }

};

/* 📄 GET ALL MATERIALS */
export const getMaterials = async (req, res, next) => {

  try {

    const materials = await Material.find({ isActive: true })
      .populate("classId", "name")
      .populate("subjectId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: materials
    });

  } catch (error) {
    next(error);
  }

};

/* 🔍 GET MATERIAL BY ID */
export const getMaterialById = async (req, res, next) => {

  try {

    const material = await Material.findById(req.params.id)
      .populate("classId", "name")
      .populate("subjectId", "name");

    if (!material) {
      return next(new Error("Material not found"));
    }

    res.json({
      success: true,
      data: material
    });

  } catch (error) {
    next(error);
  }

};

/* ✏ UPDATE MATERIAL */
export const updateMaterial = async (req, res, next) => {

  try {

    const material = await Material.findById(req.params.id);

    if (!material) {
      return next(new Error("Material not found"));
    }

    const updates = req.body;
    Object.assign(material, updates);

    await material.save();

    res.json({
      success: true,
      message: "Material updated successfully",
      data: material
    });

  } catch (error) {
    next(error);
  }

};

/* ❌ DELETE MATERIAL */
export const deleteMaterial = async (req, res, next) => {

  try {

    const material = await Material.findById(req.params.id);

    if (!material) {
      return next(new Error("Material not found"));
    }

    if (material.cloudinaryId) {
      await cloudinary.uploader.destroy(material.cloudinaryId, {
        resource_type: "raw"
      });
    }

    await material.deleteOne();

    res.json({
      success: true,
      message: "Material deleted successfully"
    });

  } catch (error) {
    next(error);
  }

};