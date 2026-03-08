import React, { useEffect, useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import axios from "axios";

function ManageSubjects() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");

  const token = localStorage.getItem("token");

  /* 📚 Load Classes */
  const fetchClasses = async () => {
    const res = await axios.get("/api/classes");
    setClasses(res.data);
    if (res.data.length) setSelectedClass(res.data[0]._id);
  };

  /* 📄 Load Subjects */
  const fetchSubjects = async (classId) => {
    const res = await axios.get(`/api/subjects?classId=${classId}`);
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchSubjects(selectedClass);
  }, [selectedClass]);

  /* ➕ Add Subject */
  const handleAddSubject = async () => {

    if (!newSubject.trim()) return;

    await axios.post(
      "/api/subjects",
      {
        name: newSubject,
        classId: selectedClass
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setNewSubject("");
    fetchSubjects(selectedClass);
  };

  /* ❌ Delete Subject */
  const handleDelete = async (id) => {

    await axios.delete(`/api/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchSubjects(selectedClass);
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
          className="border p-3 rounded-lg"
        >

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}

        </select>
      </div>

      {/* Add Subject */}
      <div className="flex gap-3 mb-8">

        <input
          type="text"
          placeholder="Enter subject name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        />

        <button
          onClick={handleAddSubject}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>

      </div>

      {/* Subject List */}
      <div className="grid md:grid-cols-2 gap-6">

        {subjects.map((subject) => (

          <div
            key={subject._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >

            <span className="font-semibold text-lg">
              {subject.name}
            </span>

            <button
              onClick={() => handleDelete(subject._id)}
              className="text-red-500"
            >
              <Trash2 size={18} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ManageSubjects;