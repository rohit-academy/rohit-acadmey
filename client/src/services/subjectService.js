import API from "./api";

// 📚 Get subjects by class (Class 9,10)
export const getSubjectsByClass = (classId) => {
  return API.get(`/subjects/class/${classId}`);
};

// 🎓 Get subjects by class + stream (11/12)
export const getSubjectsByStream = (classId, streamId) => {
  return API.get(`/subjects/class/${classId}/stream/${streamId}`);
};

// ➕ Add subject (Admin)
export const createSubject = (subjectData) => {
  return API.post("/subjects", subjectData);
};

// ✏ Update subject (Admin)
export const updateSubject = (id, subjectData) => {
  return API.put(`/subjects/${id}`, subjectData);
};

// ❌ Delete subject (Admin)
export const deleteSubject = (id) => {
  return API.delete(`/subjects/${id}`);
};
