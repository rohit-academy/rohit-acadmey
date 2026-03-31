import Class from "../models/Class.js";
import logger from "../utils/logger.js";

/* =====================================
   🔧 HELPER: EXTRACT CLASS NUMBER
===================================== */
const extractClassNumber = (name) => {
  const num = parseInt(name);
  return isNaN(num) ? null : num;
};

/* =====================================
   ➕ ADD CLASS
===================================== */
export const addClass = async (req, res) => {
  try {

    let { name } = req.body;

    if (!name || name.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid class name required",
      });
    }

    name = name.trim().toLowerCase();

    /* 🔢 EXTRACT NUMBER */
    const classNumber = extractClassNumber(name);

    if (!classNumber) {
      return res.status(400).json({
        success: false,
        message: "Class name must include a number (e.g., 10, 11, 12)",
      });
    }

    /* ❌ DUPLICATE CHECK */
    const existing = await Class.findOne({
      $or: [{ name }, { classNumber }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Class already exists",
      });
    }

    /* 🔥 STREAM LOGIC */
    const hasStreams = classNumber >= 11;

    const newClass = await Class.create({
      name,
      classNumber,
      hasStreams
    });

    logger.info(`✅ Class created: ${name} (${classNumber})`);

    res.status(201).json({
      success: true,
      data: newClass,
    });

  } catch (error) {
    logger.error(`❌ Add class error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================
   📄 GET CLASSES
===================================== */
export const getClasses = async (req, res) => {
  try {

    const classes = await Class.find({ isActive: true })
      .sort({ order: 1, classNumber: 1 });

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

    const classDoc = await Class.findById(req.params.id);

    if (!classDoc || !classDoc.isActive) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      data: classDoc,
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
   ✏ UPDATE CLASS
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

    /* 🔥 UPDATE NAME */
    if (name) {

      const newName = name.trim().toLowerCase();
      const classNumber = extractClassNumber(newName);

      if (!classNumber) {
        return res.status(400).json({
          success: false,
          message: "Invalid class number",
        });
      }

      const exists = await Class.findOne({
        $or: [{ name: newName }, { classNumber }]
      });

      if (exists && exists._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Class already exists",
        });
      }

      classDoc.name = newName;
      classDoc.classNumber = classNumber;
      classDoc.hasStreams = classNumber >= 11;
    }

    if (order !== undefined) classDoc.order = order;
    if (isActive !== undefined) classDoc.isActive = isActive;

    await classDoc.save();

    logger.info(`✏️ Class updated: ${classDoc.name}`);

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
   ❌ DELETE CLASS (SOFT)
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

    classDoc.isActive = false;
    await classDoc.save();

    logger.warn(`🗑 Class deactivated: ${classDoc.name}`);

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