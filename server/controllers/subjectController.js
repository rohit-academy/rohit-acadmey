import Subject from "../models/Subject.js";
import Class from "../models/Class.js";

/* =====================================
   ➕ ADD SUBJECT
===================================== */
export const addSubject = async (req, res) => {
  try {

    let { name, classId, streamId } = req.body;

    if (!name || !classId) {
      return res.status(400).json({
        success: false,
        message: "Name and Class required"
      });
    }

    name = name.trim().toLowerCase();

    /* 🔍 CHECK CLASS */
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    /* 🔥 STREAM VALIDATION (VERY IMPORTANT) */
    if (cls.hasStreams && !streamId) {
      return res.status(400).json({
        success: false,
        message: "Stream is required for this class"
      });
    }

    if (!cls.hasStreams) {
      streamId = null; // 🔥 force null for 1–10
    }

    /* ❌ DUPLICATE CHECK */
    const existing = await Subject.findOne({
      name,
      classId,
      streamId: streamId || null
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists"
      });
    }

    const subject = await Subject.create({
      name,
      classId,
      streamId
    });

    res.status(201).json({
      success: true,
      data: subject
    });

  } catch (error) {
    console.error("Add subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to add subject"
    });
  }
};

/* =====================================
   📄 GET SUBJECTS
===================================== */
export const getSubjects = async (req, res) => {
  try {

    const { classId, streamId } = req.query;

    const filter = {
      isActive: true
    };

    if (classId) filter.classId = classId;
    if (streamId) filter.streamId = streamId;

    const subjects = await Subject.find(filter)
      .populate("classId", "name classNumber")
      .populate("streamId", "name")
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    console.error("Fetch subjects error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects"
    });
  }
};

/* =====================================
   🔍 GET SUBJECT BY ID
===================================== */
export const getSubjectById = async (req, res) => {
  try {

    const subject = await Subject.findById(req.params.id)
      .populate("classId", "name classNumber")
      .populate("streamId", "name");

    if (!subject || !subject.isActive) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      data: subject
    });

  } catch (error) {
    console.error("Get subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching subject"
    });
  }
};

/* =====================================
   ✏ UPDATE SUBJECT
===================================== */
export const updateSubject = async (req, res) => {
  try {

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const {
      name,
      streamId,
      description,
      icon,
      order,
      isActive
    } = req.body;

    /* 🔍 CLASS CHECK */
    const cls = await Class.findById(subject.classId);

    if (!cls) {
      return res.status(400).json({
        success: false,
        message: "Invalid class"
      });
    }

    /* 🔥 STREAM VALIDATION */
    if (cls.hasStreams && !streamId) {
      return res.status(400).json({
        success: false,
        message: "Stream required for this class"
      });
    }

    /* 🔥 SAFE UPDATE */
    if (name) subject.name = name.trim().toLowerCase();
    if (cls.hasStreams) subject.streamId = streamId;
    if (!cls.hasStreams) subject.streamId = null;

    if (description !== undefined) subject.description = description;
    if (icon !== undefined) subject.icon = icon;
    if (order !== undefined) subject.order = order;
    if (isActive !== undefined) subject.isActive = isActive;

    await subject.save();

    res.json({
      success: true,
      data: subject
    });

  } catch (error) {
    console.error("Update subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

/* =====================================
   ❌ DELETE SUBJECT (SOFT)
===================================== */
export const deleteSubject = async (req, res) => {
  try {

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    subject.isActive = false;
    await subject.save();

    res.json({
      success: true,
      message: "Subject deleted (soft)"
    });

  } catch (error) {
    console.error("Delete subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};