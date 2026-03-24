import Class from "../models/Class.js";
import logger from "../utils/logger.js";

/* =====================================
   ➕ ADD CLASS
===================================== */
export const addClass = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Valid class name required",
      });
    }

    name = name.trim().toLowerCase(); // 🔥 FIX

    /* ❌ DUPLICATE SAFE */
    const existing = await Class.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Class already exists",
      });
    }

    const newClass = await Class.create({ name });

    logger.info(`Class created: ${name}`);

    res.status(201).json({
      success: true,
      data: newClass,
    });

  } catch (error) {
    logger.error(`Add class error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================
   📄 GET CLASSES (ONLY ACTIVE)
===================================== */
export const getClasses = async (req, res) => {
  try {

    const classes = await Class.find({ isActive: true }) // 🔥 FIX
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: classes,
    });

  } catch (error) {
    logger.error(`Get classes error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================
   🔍 GET CLASS BY ID
===================================== */
export const getClassById = async (req, res) => {
  try {

    const singleClass = await Class.findById(req.params.id);

    if (!singleClass || !singleClass.isActive) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      data: singleClass,
    });

  } catch (error) {
    logger.error(`Get class error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================
   ✏ UPDATE CLASS (SAFE)
===================================== */
export const updateClass = async (req, res) => {
  try {

    let { name, order, isActive } = req.body;

    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    /* 🔥 SAFE UPDATE */
    if (name) {
      const newName = name.trim().toLowerCase();

      const exists = await Class.findOne({ name: newName });

      if (exists && exists._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Class name already exists",
        });
      }

      classDoc.name = newName;
    }

    if (order !== undefined) classDoc.order = order;
    if (isActive !== undefined) classDoc.isActive = isActive;

    await classDoc.save();

    logger.info(`Class updated: ${classDoc.name}`);

    res.json({
      success: true,
      data: classDoc,
    });

  } catch (error) {
    logger.error(`Update class error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================
   ❌ DELETE CLASS (SOFT DELETE)
===================================== */
export const deleteClass = async (req, res) => {
  try {

    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    /* 🔥 SOFT DELETE */
    classDoc.isActive = false;
    await classDoc.save();

    logger.warn(`Class deactivated: ${classDoc.name}`);

    res.json({
      success: true,
      message: "Class deactivated",
    });

  } catch (error) {
    logger.error(`Delete class error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};