import API from "./api";

// 📚 Get all classes (9,10,11,12, BA, BSc, BCom)
export const getAllClasses = () => {
  return API.get("/classes");
};

// ➕ Add new class (Admin)
export const createClass = (classData) => {
  return API.post("/classes", classData);
};

// ✏ Update class (Admin)
export const updateClass = (id, classData) => {
  return API.put(`/classes/${id}`, classData);
};

// ❌ Delete class (Admin)
export const deleteClass = (id) => {
  return API.delete(`/classes/${id}`);
};
