import mongoose from "mongoose";
import Stream from "../models/Stream.js";
import Class from "../models/Class.js";
import logger from "../utils/logger.js";

/* =====================================
   ➕ CREATE STREAM
===================================== */
export const createStream = async (req, res) => {
  try {

    const { name, classId, order } = req.body;

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

    /* 🔍 CHECK CLASS */
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    /* 🔥 STREAM ONLY FOR 11+ */
    if (!cls.requiresStream) {
      return res.status(400).json({
        success: false,
        message: "Streams not allowed for this class"
      });
    }

    /* ❌ DUPLICATE CHECK */
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
      order: order || 0
    });

    logger.info(`Stream created: ${name}`);

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
    }).sort({ order: 1, createdAt: 1 });

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
    const { name, order, isActive } = req.body;

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

    if (name) stream.name = name;
    if (order !== undefined) stream.order = order;
    if (isActive !== undefined) stream.isActive = isActive;

    await stream.save();

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
   ❌ DELETE STREAM
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

    await stream.deleteOne();

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