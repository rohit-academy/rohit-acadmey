import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ☁️ Upload PDF → Cloudinary */
const uploadPDFToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "materials",
        resource_type: "raw",   // ✅ correct for PDF
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }

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

    /* Upload PDF */
    const result = await uploadPDFToCloudinary(req.file.buffer);

    const material = await Material.create({

      title: title.trim(),
      description: description?.trim() || "",
      classId,
      subjectId,
      type,
      pages: pages || 0,
      price,

      fileUrl: result.secure_url,
      cloudinaryId: result.public_id

    });

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

    const {
      page = 1,
      limit = 12,
      classId,
      subjectId,
      type,
      search = ""
    } = req.query;

    const filter = { isActive: true };

    if (classId) filter.classId = classId;
    if (subjectId) filter.subjectId = subjectId;
    if (type) filter.type = type;

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i"
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

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

    logger.error(`Get materials error: ${error.message}`);
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

      const err = new Error("Material not found");
      err.statusCode = 404;
      return next(err);

    }

    res.json({
      success: true,
      data: material
    });

  } catch (error) {

    logger.error(`Get material error: ${error.message}`);
    next(error);

  }

};


/* ✏ UPDATE MATERIAL */
export const updateMaterial = async (req, res, next) => {

  try {

    const material = await Material.findById(req.params.id);

    if (!material) {
      const err = new Error("Material not found");
      err.statusCode = 404;
      return next(err);
    }

    const updates = req.body;

    if (updates.price && (updates.price < 0 || updates.price > 5000)) {
      const err = new Error("Invalid price range");
      err.statusCode = 400;
      return next(err);
    }

    /* Replace PDF */
    if (req.file) {

      if (material.cloudinaryId) {
        await cloudinary.uploader.destroy(material.cloudinaryId, {
          resource_type: "raw"
        });
      }

      const result = await uploadPDFToCloudinary(req.file.buffer);

      material.fileUrl = result.secure_url;
      material.cloudinaryId = result.public_id;

    }

    material.title = updates.title?.trim() || material.title;
    material.description = updates.description?.trim() || material.description;
    material.price = updates.price ?? material.price;
    material.classId = updates.classId || material.classId;
    material.subjectId = updates.subjectId || material.subjectId;
    material.type = updates.type || material.type;
    material.pages = updates.pages ?? material.pages;

    await material.save();

    logger.warn(`Material updated: ${material.title}`);

    res.json({
      success: true,
      message: "Material updated successfully",
      data: material
    });

  } catch (error) {

    logger.error(`Update material error: ${error.message}`);
    next(error);

  }

};


/* ❌ DELETE MATERIAL */
export const deleteMaterial = async (req, res, next) => {

  try {

    const material = await Material.findById(req.params.id);

    if (!material) {
      const err = new Error("Material not found");
      err.statusCode = 404;
      return next(err);
    }

    if (material.cloudinaryId) {

      await cloudinary.uploader.destroy(material.cloudinaryId, {
        resource_type: "raw"
      });

    }

    await material.deleteOne();

    logger.warn(`Material deleted: ${material.title}`);

    res.json({
      success: true,
      message: "Material deleted successfully"
    });

  } catch (error) {

    logger.error(`Delete material error: ${error.message}`);
    next(error);

  }

};