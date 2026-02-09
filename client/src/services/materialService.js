import API from "./api";

// 📚 Get materials by subject (Physics, Maths, etc.)
export const getMaterialsBySubject = (subjectId) => {
  return API.get(`/materials/subject/${subjectId}`);
};

// 📄 Get single material details
export const getMaterialById = (id) => {
  return API.get(`/materials/${id}`);
};

// 🔍 Search materials
export const searchMaterials = (query) => {
  return API.get(`/materials/search?q=${query}`);
};

// ➕ Upload new material (Admin)
export const uploadMaterial = (formData) => {
  return API.post("/materials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✏ Update material (Admin)
export const updateMaterial = (id, formData) => {
  return API.put(`/materials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ❌ Delete material (Admin)
export const deleteMaterial = (id) => {
  return API.delete(`/materials/${id}`);
};

// ⭐ Rate material
export const rateMaterial = (id, rating) => {
  return API.post(`/materials/${id}/rate`, { rating });
};
