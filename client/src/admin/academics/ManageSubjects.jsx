import React, { useState } from "react";
import { Plus, Trash2, Edit2, BookOpen } from "lucide-react";

function ManageSubjects() {
  const [selectedClass, setSelectedClass] = useState("9");

  const [subjectData, setSubjectData] = useState({
    "9": ["Hindi", "English", "Science", "Maths"],
    "10": ["Hindi", "English", "Science", "Maths"],
    "11": ["Physics", "Chemistry", "Biology"],
    "12": ["Physics", "Chemistry", "Biology"]
  });

  const [newSubject, setNewSubject] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const subjects = subjectData[selectedClass] || [];

  // ➕ Add Subject
  const handleAddSubject = () => {
    if (!newSubject.trim()) return;

    setSubjectData({
      ...subjectData,
      [selectedClass]: [...subjects, newSubject]
    });

    setNewSubject("");
  };

  // 🗑 Delete Subject
  const handleDelete = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjectData({ ...subjectData, [selectedClass]: updated });
  };

  // ✏ Save Edited Subject
  const handleEditSave = (index, name) => {
    const updated = subjects.map((sub, i) => (i === index ? name : sub));
    setSubjectData({ ...subjectData, [selectedClass]: updated });
    setEditingIndex(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="text-blue-600" /> Manage Subjects
      </h1>

      {/* Select Class */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>
      </div>

      {/* Add Subject */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter subject name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Subject List */}
      <div className="grid md:grid-cols-2 gap-6">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            {editingIndex === index ? (
              <input
                defaultValue={subject}
                onBlur={(e) => handleEditSave(index, e.target.value)}
                autoFocus
                className="border p-2 rounded w-full mr-3"
              />
            ) : (
              <span className="font-semibold text-lg">{subject}</span>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setEditingIndex(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={18} />
              </button>

              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSubjects;
