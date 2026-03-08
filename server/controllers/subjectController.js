import Subject from "../models/Subject.js";
import Class from "../models/Class.js";

/* ➕ ADD SUBJECT (Admin) */
export const addSubject = async (req, res) => {
  try {
    const { name, classId, stream } = req.body;

    if (!name || !classId) {
      return res.status(400).json({
        success: false,
        message: "Name and Class required"
      });
    }

    /* 🔍 Check class exists */
    const classExists = await Class.findById(classId);

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    /* ❌ Prevent duplicate subject */
    const existing = await Subject.findOne({
      name,
      classId,
      stream
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists in this class"
      });
    }

    const subject = await Subject.create({
      name,
      classId,
      stream
    });

    res.status(201).json({
      success: true,
      data: subject
    });

  } catch (error) {

    console.error("Add subject error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add subject"
    });

  }
};


/* 📄 GET ALL SUBJECTS */
export const getSubjects = async (req, res) => {
  try {

    const { classId, stream } = req.query;

    const filter = {};

    if (classId) filter.classId = classId;
    if (stream) filter.stream = stream;

    const subjects = await Subject.find(filter)
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {

    console.error("Fetch subjects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects"
    });

  }
};


/* 🔍 GET SUBJECT BY ID */
export const getSubjectById = async (req, res) => {
  try {

    const subject = await Subject.findById(req.params.id)
      .populate("classId", "name");

    if (!subject) {
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

    console.error("Get subject error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching subject"
    });

  }
};


/* ✏ UPDATE SUBJECT */
export const updateSubject = async (req, res) => {
  try {

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    Object.assign(subject, req.body);

    await subject.save();

    res.json({
      success: true,
      data: subject
    });

  } catch (error) {

    console.error("Update subject error:", error);

    res.status(500).json({
      success: false,
      message: "Update failed"
    });

  }
};


/* ❌ DELETE SUBJECT */
export const deleteSubject = async (req, res) => {
  try {

    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.json({
      success: true,
      message: "Subject deleted successfully"
    });

  } catch (error) {

    console.error("Delete subject error:", error);

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });

  }
};