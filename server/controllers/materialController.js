import Material from "../models/Material.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import logger from "../utils/logger.js";

/* ➕ ADD MATERIAL (Admin) */
export const addMaterial = async (req, res) => {
  try {
    const { title, classId, subjectId, price, description, fileUrl } = req.body;

    if (!title || !classId || !subjectId || !price || !fileUrl) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (price < 1 || price > 5000) {
      return res.status(400).json({ message: "Invalid price range" });
    }

    const classExists = await Class.findById(classId);
    const subjectExists = await Subject.findById(subjectId);

    if (!classExists || !subjectExists) {
      return res.status(400).json({ message: "Invalid class or subject" });
    }

    const material = await Material.create({
      title: title.trim(),
      class: classId,
      subject: subjectId,
      price,
      description: description?.trim() || "",
      fileUrl
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

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(material);
  } catch (error) {
    logger.error(`Get material error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ✏ UPDATE MATERIAL */
export const updateMaterial = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.price && (updates.price < 1 || updates.price > 5000)) {
      return res.status(400).json({ message: "Invalid price range" });
    }

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

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
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    logger.warn(`Material deleted: ${material.title}`);

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    logger.error(`Delete material error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
