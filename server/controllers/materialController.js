import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import fs from "fs";
import path from "path";
import { generatePreview } from "../utils/pdfPreview.js";

/* ☁️ Upload PDF → Cloudinary */
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

    /* ✅ FILE ACCESS FIX */
    const pdfFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!title || !classId || !subjectId || !price || !type) {
      return next(new Error("Required fields missing"));
    }

    if (!pdfFile) {
      return next(new Error("PDF file is required"));
    }

    if (!pdfFile.mimetype.includes("pdf")) {
      return next(new Error("Only PDF files allowed"));
    }

    if (pdfFile.size > 10 * 1024 * 1024) {
      return next(new Error("File size must be under 10MB"));
    }

    const classExists = await Class.findById(classId);
    const subjectExists = await Subject.findById(subjectId);

    if (!classExists || !subjectExists) {
      return next(new Error("Invalid class or subject"));
    }

    /* 📂 TEMP PDF SAVE */

    const uploadsDir = path.join("uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const tempPdfPath = `uploads/${Date.now()}.pdf`;
    fs.writeFileSync(tempPdfPath, pdfFile.buffer);

    /* 🖼 GENERATE PREVIEW */
    await generatePreview(tempPdfPath, "uploads");

    /* ☁️ Upload PDF */
    const result = await uploadPDFToCloudinary(pdfFile.buffer);

    /* 🖼 Upload preview images */
    const preview1 = await cloudinary.uploader.upload(
      "uploads/preview-1.jpg",
      { folder: "materials/previews" }
    );

    const preview2 = await cloudinary.uploader.upload(
      "uploads/preview-2.jpg",
      { folder: "materials/previews" }
    );

    /* 🖼 Upload thumbnail (optional) */
    let thumbnailUrl = "";

    if (thumbnailFile) {

      const thumbUpload = await cloudinary.uploader.upload_stream(
        { folder: "materials/thumbnails" },
        (error, result) => {
          if (error) throw error;
          thumbnailUrl = result.secure_url;
        }
      );

      streamifier.createReadStream(thumbnailFile.buffer).pipe(thumbUpload);
    }

    /* 💾 SAVE */
    const material = await Material.create({

      title: title.trim(),
      description: description?.trim() || "",
      classId,
      subjectId,
      type,
      pages: pages || 0,
      price,

      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,

      thumbnail: thumbnailUrl,

      previewImages: [
        preview1.secure_url,
        preview2.secure_url
      ]

    });

    /* 🧹 CLEANUP */
    fs.unlinkSync(tempPdfPath);
    fs.unlinkSync("uploads/preview-1.jpg");
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


/* 📄 GET MATERIALS */
export const getMaterials = async (req, res, next) => {

  try {

    const { page = 1, limit = 12, classId, subjectId, type, search = "", admin } = req.query;

    const filter = {};

    if (!admin) filter.isActive = true;
    if (classId) filter.classId = classId;
    if (subjectId) filter.subjectId = subjectId;
    if (type) filter.type = type;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const materials = await Material.find(filter)
      .populate("classId", "name")
      .populate("subjectId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Material.countDocuments(filter);

    res.json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
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

    res.json({ success: true, data: material });

  } catch (error) {
    next(error);
  }

};


/* ✏ UPDATE MATERIAL */
export const updateMaterial = async (req, res, next) => {

  try {

    const material = await Material.findById(req.params.id);

    if (!material) return next(new Error("Material not found"));

    const updates = req.body;

    material.title = updates.title || material.title;
    material.description = updates.description || material.description;
    material.price = updates.price ?? material.price;
    material.classId = updates.classId || material.classId;
    material.subjectId = updates.subjectId || material.subjectId;
    material.type = updates.type || material.type;
    material.pages = updates.pages ?? material.pages;

    /* 🖼 Thumbnail update */
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (thumbnailFile) {

      const upload = await cloudinary.uploader.upload_stream(
        { folder: "materials/thumbnails" },
        (error, result) => {
          if (error) throw error;
          material.thumbnail = result.secure_url;
        }
      );

      streamifier.createReadStream(thumbnailFile.buffer).pipe(upload);
    }

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

    if (!material) return next(new Error("Material not found"));

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