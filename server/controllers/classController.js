import Class from "../models/Class.js";
import logger from "../utils/logger.js";

/* ➕ ADD CLASS (Admin) */
export const addClass = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Valid class name required" });
    }

    name = name.trim();

    const existing = await Class.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const newClass = await Class.create({ name });

    logger.info(`Class created: ${name}`);

    res.status(201).json(newClass);
  } catch (error) {
    logger.error(`Add class error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* 📄 GET ALL CLASSES */
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    logger.error(`Get classes error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* 🔍 GET CLASS BY ID */
export const getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findById(req.params.id);

    if (!singleClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(singleClass);
  } catch (error) {
    logger.error(`Get class error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ✏ UPDATE CLASS */
export const updateClass = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Valid class name required" });
    }

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Class not found" });
    }

    logger.info(`Class updated: ${updated.name}`);

    res.json(updated);
  } catch (error) {
    logger.error(`Update class error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ❌ DELETE CLASS */
export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }

    logger.warn(`Class deleted: ${deleted.name}`);

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    logger.error(`Delete class error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
