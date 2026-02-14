import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ☁️ Upload buffer → Cloudinary */
const uploadPDFToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "materials",
        resource_type: "raw",
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
    const { title, classId, subjectId, price, description } = req.body;

    if (!title || !classId || !subjectId || !price) {
      const err = new Error("All required fields must be filled");
      err.statusCode = 400;
      return next(err);
    }

    if (!req.file) {
      const err = new Error("PDF file is required");
      err.statusCode = 400;
      return next(err);
    }

    if (price < 1 || price > 5000) {
      const err = new Error("Invalid price range");
      err.statusCode = 400;
      return next(err);
    }

    const classExists = await Class.findById(classId);
    const subjectExists = await Subject.findById(subjectId);

    if (!classExists || !subjectExists) {
      const err = new Error("Invalid class or subject");
      err.statusCode = 400;
      return next(err);
    }

    /* ☁️ Upload PDF */
    const result = await uploadPDFToCloudinary(req.file.buffer);

    const material = await Material.create({
      title: title.trim(),
      class: classId,
      subject: subjectId,
      price,
      description: description?.trim() || "",
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    logger.info(`Material added: ${material.title}`);

    res.status(201).json({
      success: true,
      message: "Material added successfully",
      data: material,
    });
  } catch (error) {
    logger.error(`Add material error: ${error.message}`);
    next(error);
  }
};

/* 📄 GET ALL MATERIALS */
export const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find()
      .populate("class", "name")
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials,
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
      .populate("class", "name")
      .populate("subject", "name");

    if (!material) {
      const err = new Error("Material not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({
      success: true,
      data: material,
    });
  } catch (error) {
    logger.error(`Get material error: ${error.message}`);
    next(error);
  }
};

/* ✏ UPDATE MATERIAL */
export const updateMaterial = async (req, res, next) => {
  try {
    const updates = req.body;

    const material = await Material.findById(req.params.id);
    if (!material) {
      const err = new Error("Material not found");
      err.statusCode = 404;
      return next(err);
    }

    if (updates.price && (updates.price < 1 || updates.price > 5000)) {
      const err = new Error("Invalid price range");
      err.statusCode = 400;
      return next(err);
    }

    /* 🔁 Replace PDF */
    if (req.file) {
      if (material.cloudinaryId) {
        await cloudinary.uploader.destroy(material.cloudinaryId, {
          resource_type: "raw",
        });
      }

      const result = await uploadPDFToCloudinary(req.file.buffer);
      material.fileUrl = result.secure_url;
      material.cloudinaryId = result.public_id;
    }

    material.title = updates.title?.trim() || material.title;
    material.description = updates.description?.trim() || material.description;
    material.price = updates.price || material.price;
    material.class = updates.classId || material.class;
    material.subject = updates.subjectId || material.subject;

    await material.save();

    logger.warn(`Material updated: ${material.title}`);

    res.json({
      success: true,
      message: "Material updated successfully",
      data: material,
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
        resource_type: "raw",
      });
    }

    await material.deleteOne();

    logger.warn(`Material deleted: ${material.title}`);

    res.json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete material error: ${error.message}`);
    next(error);
  }
};
