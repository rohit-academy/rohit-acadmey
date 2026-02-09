import React, { useState } from "react";
import { Plus, Trash2, Edit2, GraduationCap } from "lucide-react";

function ManageClasses() {
  const [classes, setClasses] = useState([
    { id: "9", name: "Class 9" },
    { id: "10", name: "Class 10" },
    { id: "11", name: "Class 11" },
    { id: "12", name: "Class 12" }
  ]);

  const [newClass, setNewClass] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleAddClass = () => {
    if (!newClass.trim()) return;
    setClasses([...classes, { id: Date.now().toString(), name: newClass }]);
    setNewClass("");
  };

  const handleDelete = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id));
  };

  const handleEditSave = (id, name) => {
    setClasses(classes.map((cls) => (cls.id === id ? { ...cls, name } : cls)));
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <GraduationCap className="text-blue-600" /> Manage Classes
      </h1>

      {/* ➕ ADD CLASS (STACKS ON MOBILE) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter class name (e.g. Class 8)"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 outline-none w-full"
        />
        <button
          onClick={handleAddClass}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      {/* 📚 CLASS LIST */}
      <div className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white p-4 sm:p-5 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {editingId === cls.id ? (
              <input
                defaultValue={cls.name}
                onBlur={(e) => handleEditSave(cls.id, e.target.value)}
                autoFocus
                className="border p-2 rounded w-full sm:w-72"
              />
            ) : (
              <span className="font-semibold text-lg">{cls.name}</span>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 justify-end sm:justify-start">
              <button
                onClick={() => setEditingId(cls.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={20} />
              </button>

              <button
                onClick={() => handleDelete(cls.id)}
                className="text-red-500 hover:text-red-700"
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
