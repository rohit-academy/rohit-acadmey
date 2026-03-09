import API from "./api";

/* 📚 Get subjects by class */
export const getSubjectsByClass = (classId) => {
  return API.get(`/subjects?classId=${classId}`);
};

/* 🎓 Get subjects by class + stream */
export const getSubjectsByStream = (classId, stream) => {
  return API.get(`/subjects?classId=${classId}&stream=${stream}`);
};

/* ➕ Add subject (Admin) */
export const createSubject = (subjectData) => {
  return API.post("/subjects", subjectData);
};

/* ✏ Update subject (Admin) */
export const updateSubject = (id, subjectData) => {
  return API.put(`/subjects/${id}`, subjectData);
};

/* ❌ Delete subject (Admin) */
export const deleteSubject = (id) => {
  return API.delete(`/subjects/${id}`);
};

/* 📄 Get all subjects */
export const getAllSubjects = () => {
  return API.get("/subjects");
};