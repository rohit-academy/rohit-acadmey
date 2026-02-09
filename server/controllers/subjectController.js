import Subject from "../models/Subject.js";
import Class from "../models/Class.js";

/* ➕ ADD SUBJECT (Admin) */
export const addSubject = async (req, res) => {
  try {
    const { name, classId, stream } = req.body;

    if (!name || !classId)
      return res.status(400).json({ message: "Name and Class required" });

    /* 🔍 Check class exists */
    const classExists = await Class.findById(classId);
    if (!classExists)
      return res.status(404).json({ message: "Class not found" });

    /* ❌ Prevent duplicate subject in same class */
    const existing = await Subject.findOne({ name, class: classId, stream });
    if (existing)
      return res.status(400).json({ message: "Subject already exists in this class" });

    const subject = await Subject.create({
      name,
      class: classId,
      stream,
    });

    res.status(201).json(subject);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add subject" });
  }
};


/* 📄 GET ALL SUBJECTS */
export const getSubjects = async (req, res) => {
  try {
    const { classId, stream } = req.query;

    const filter = {};
    if (classId) filter.class = classId;
    if (stream) filter.stream = stream;

    const subjects = await Subject.find(filter)
      .populate("class", "name")
      .sort({ createdAt: -1 });

    res.json(subjects);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};


/* 🔍 GET SUBJECT BY ID */
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("class", "name");

    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    res.json(subject);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subject" });
  }
};


/* ✏ UPDATE SUBJECT */
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    Object.assign(subject, req.body);
    await subject.save();

    res.json(subject);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};


/* ❌ DELETE SUBJECT */
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    res.json({ message: "Subject deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};
