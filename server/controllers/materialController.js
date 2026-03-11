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

    /* Validation */

    if (!title || !classId || !subjectId || !price || !type) {
      const err = new Error("Required fields missing");
      err.statusCode = 400;
      return next(err);
    }

    if (!req.file) {
      const err = new Error("PDF file is required");
      err.statusCode = 400;
      return next(err);
    }

    if (!req.file.mimetype.includes("pdf")) {
      const err = new Error("Only PDF files allowed");
      err.statusCode = 400;
      return next(err);
    }

    if (req.file.size > 10 * 1024 * 1024) {
      const err = new Error("File size must be under 10MB");
      err.statusCode = 400;
      return next(err);
    }

    /* Check class + subject */

    const classExists = await Class.findById(classId);
    const subjectExists = await Subject.findById(subjectId);

    if (!classExists || !subjectExists) {
      const err = new Error("Invalid class or subject");
      err.statusCode = 400;
      return next(err);
    }

    /* TEMP PDF SAVE */

    const uploadsDir = path.join("uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const tempPdfPath = `uploads/${Date.now()}.pdf`;

    fs.writeFileSync(tempPdfPath, req.file.buffer);

    /* GENERATE PREVIEW IMAGES */

    await generatePreview(tempPdfPath, "uploads");

    /*
    creates:
    uploads/preview-1.jpg
    uploads/preview-2.jpg
    */

    /* Upload PDF */

    const result = await uploadPDFToCloudinary(req.file.buffer);

    /* Upload preview images */

    const preview1 = await cloudinary.uploader.upload(
      "uploads/preview-1.jpg",
      { folder: "materials/previews" }
    );

    const preview2 = await cloudinary.uploader.upload(
      "uploads/preview-2.jpg",
      { folder: "materials/previews" }
    );

    /* SAVE MATERIAL */

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

      previewImages: [
        preview1.secure_url,
        preview2.secure_url
      ]

    });

    /* DELETE TEMP FILES */

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