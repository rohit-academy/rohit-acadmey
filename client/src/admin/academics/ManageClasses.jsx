import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, GraduationCap } from "lucide-react";
import API from "../../services/api";

function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* 📦 FETCH CLASSES FROM DB */
  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");

      if (res.data?.success) {
        setClasses(res.data.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Fetch class error:", err);
      setClasses([]);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  /* ➕ ADD CLASS → DB */
  const handleAddClass = async () => {
    if (!newClass.trim()) return;

    try {
      const res = await API.post("/classes", { name: newClass });

      if (res.data?.success) {
        setNewClass("");
        fetchClasses(); // 🔥 refresh from DB
      }
    } catch (err) {
      alert(err.response?.data?.message || "Add class failed");
    }
  };

  /* ❌ DELETE CLASS */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/classes/${id}`);
      fetchClasses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ✏ UPDATE CLASS */
  const handleEditSave = async (id, name) => {
    if (!name.trim()) return;

    try {
      await API.put(`/classes/${id}`, { name });
      setEditingId(null);
      fetchClasses();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <GraduationCap className="text-blue-600" /> Manage Classes
      </h1>

      {/* ADD CLASS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter class name (e.g. Class 8)"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        />
        <button
          onClick={handleAddClass}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      {/* CLASS LIST */}
      <div className="space-y-4">
        {classes.length === 0 && (
          <div className="text-gray-500">No classes found</div>
        )}

        {classes.map((cls) => (
          <div
            key={cls._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            {editingId === cls._id ? (
              <input
                defaultValue={cls.name}
                onBlur={(e) => handleEditSave(cls._id, e.target.value)}
                autoFocus
                className="border p-2 rounded w-64"
              />
            ) : (
              <span className="font-semibold text-lg">{cls.name}</span>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setEditingId(cls._id)}
                className="text-blue-600"
              >
                <Edit2 size={20} />
              </button>

              <button
                onClick={() => handleDelete(cls._id)}
                className="text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageClasses;
