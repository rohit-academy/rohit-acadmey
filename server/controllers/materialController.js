import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ☁️ Helper: Upload buffer to Cloudinary */
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
export const addMaterial = async (req, res) => {
  try {
    const { title, classId, subjectId, price, description } = req.body;

    if (!title || !classId || !subjectId || !price)
      return res.status(400).json({ message: "All required fields must be filled" });

    if (!req.file)
      return res.status(400).json({ message: "PDF file is required" });

    if (req.file.mimetype !== "application/pdf")
      return res.status(400).json({ message: "Only PDF files allowed" });

    if (price < 1 || price > 5000)
      return res.status(400).json({ message: "Invalid price range" });

    const classExists = await Class.findById(classId);
    const subjectExists = await Subject.findById(subjectId);
    if (!classExists || !subjectExists)
      return res.status(400).json({ message: "Invalid class or subject" });

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
    res.status(201).json(material);

  } catch (error) {
    logger.error(`Add material error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* 📄 GET ALL MATERIALS */
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("class", "name")
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    logger.error(`Get materials error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* 🔍 GET MATERIAL BY ID */
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("class", "name")
      .populate("subject", "name");

    if (!material) return res.status(404).json({ message: "Material not found" });

    res.json(material);
  } catch (error) {
    logger.error(`Get material error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ✏ UPDATE MATERIAL (PDF replace support) */
export const updateMaterial = async (req, res) => {
  try {
    const updates = req.body;
    const material = await Material.findById(req.params.id);

    if (!material) return res.status(404).json({ message: "Material not found" });

    if (updates.price && (updates.price < 1 || updates.price > 5000))
      return res.status(400).json({ message: "Invalid price range" });

    /* 🔁 Replace PDF if new one uploaded */
    if (req.file) {
      if (req.file.mimetype !== "application/pdf")
        return res.status(400).json({ message: "Only PDF files allowed" });

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
    res.json(material);

  } catch (error) {
    logger.error(`Update material error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ❌ DELETE MATERIAL */
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    if (material.cloudinaryId) {
      await cloudinary.uploader.destroy(material.cloudinaryId, {
        resource_type: "raw",
      });
    }

    await material.deleteOne();

    logger.warn(`Material deleted: ${material.title}`);
    res.json({ message: "Material deleted successfully" });

  } catch (error) {
    logger.error(`Delete material error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
