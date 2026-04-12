import mongoose from "mongoose";
import Stream from "../models/Stream.js";
import Class from "../models/Class.js";
import logger from "../utils/logger.js";

/* =====================================
   ➕ CREATE STREAM
===================================== */
export const createStream = async (req, res) => {
  try {

    let { name, classId, order } = req.body;

    /* ❌ VALIDATION */
    if (!name || !classId) {
      return res.status(400).json({
        success: false,
        message: "Name & classId required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classId"
      });
    }

    /* ✅ FIX: uppercase normalization */
    name = name.trim().toUpperCase();

    if (name.length < 2 || name.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid stream name"
      });
    }

    order = Number(order) || 0;
    if (order < 0) order = 0;

    /* 🔍 CHECK CLASS */
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    /* 🔥 STREAM ONLY FOR 11+ */
    const classNumber = Number(cls.name);

    if (classNumber < 11) {
      return res.status(400).json({
        success: false,
        message: "Streams only allowed for class 11 and 12"
      });
    }

    /* ✅ FIX: duplicate check */
    const exists = await Stream.findOne({
      name,
      classId
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Stream already exists for this class"
      });
    }

    const stream = await Stream.create({
      name,
      classId,
      order
    });

    logger.info(`Stream created: ${name} for class ${cls.name}`);

    res.status(201).json({
      success: true,
      data: stream
    });

  } catch (error) {

    logger.error(`Create stream error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to create stream"
    });

  }
};


/* =====================================
   📄 GET ALL STREAMS
===================================== */
export const getAllStreams = async (req, res) => {
  try {

    const streams = await Stream.find({ isActive: true })
      .populate("classId", "name classNumber")
      .sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: streams
    });

  } catch (error) {

    logger.error(`Get all streams error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to fetch streams"
    });

  }
};


/* =====================================
   📄 GET STREAMS BY CLASS
===================================== */
export const getStreamsByClass = async (req, res) => {
  try {

    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classId"
      });
    }

    const streams = await Stream.find({
      classId,
      isActive: true
    })
      .populate("classId", "name classNumber")
      .sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: streams
    });

  } catch (error) {

    logger.error(`Get streams error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to fetch streams"
    });

  }
};


/* =====================================
   ✏ UPDATE STREAM
===================================== */
export const updateStream = async (req, res) => {
  try {

    const { id } = req.params;
    let { name, order, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stream ID"
      });
    }

    const stream = await Stream.findById(id);

    if (!stream) {
      return res.status(404).json({
        success: false,
        message: "Stream not found"
      });
    }

    /* 🔥 NAME UPDATE */
    if (name) {

      name = name.trim().toUpperCase();

      if (name.length < 2 || name.length > 20) {
        return res.status(400).json({
          success: false,
          message: "Invalid stream name"
        });
      }

      /* ❌ DUPLICATE CHECK */
      const exists = await Stream.findOne({
        name,
        classId: stream.classId,
        _id: { $ne: id }
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Stream already exists"
        });
      }

      stream.name = name;
    }

    /* 🔢 ORDER UPDATE */
    if (order !== undefined) {

      order = Number(order) || 0;
      if (order < 0) order = 0;

      stream.order = order;
    }

    /* ACTIVE STATUS */
    if (isActive !== undefined) {
      stream.isActive = isActive;
    }

    await stream.save();

    logger.info(`Stream updated: ${stream.name}`);

    res.json({
      success: true,
      data: stream
    });

  } catch (error) {

    logger.error(`Update stream error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to update stream"
    });

  }
};


/* =====================================
   ❌ DELETE STREAM (SOFT DELETE)
===================================== */
export const deleteStream = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stream ID"
      });
    }

    const stream = await Stream.findById(id);

    if (!stream) {
      return res.status(404).json({
        success: false,
        message: "Stream not found"
      });
    }

    stream.isActive = false;

    await stream.save();

    logger.warn(`Stream deactivated: ${stream.name}`);

    res.json({
      success: true,
      message: "Stream deleted"
    });

  } catch (error) {

    logger.error(`Delete stream error: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Failed to delete stream"
    });

  }
};