import React, { useEffect, useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import API from "../../services/api";

function ManageSubjects() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");

  /* 📚 Load Classes */
  const fetchClasses = async () => {
    try {

      const res = await API.get("/classes");

      const classList = res.data?.data || res.data || [];

      setClasses(classList);

      if (classList.length > 0) {
        setSelectedClass(classList[0]._id);
      }

    } catch (error) {
      console.error("Fetch classes error:", error);
    }
  };

  /* 📄 Load Subjects */
  const fetchSubjects = async (classId) => {
    try {

      const res = await API.get(`/subjects?classId=${classId}`);

      const subjectList = res.data?.data || res.data || [];

      setSubjects(subjectList);

    } catch (error) {
      console.error("Fetch subjects error:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);

  /* ➕ Add Subject */
  const handleAddSubject = async () => {

    if (!newSubject.trim()) return;

    try {

      await API.post("/subjects", {
        name: newSubject,
        classId: selectedClass
      });

      setNewSubject("");

      fetchSubjects(selectedClass);

    } catch (error) {

      console.error("Add subject error:", error);

      alert(error.response?.data?.message || "Failed to add subject");

    }

  };

  /* ❌ Delete Subject */
  const handleDelete = async (id) => {

    try {

      await API.delete(`/subjects/${id}`);

      fetchSubjects(selectedClass);

    } catch (error) {

      console.error("Delete subject error:", error);

      alert("Failed to delete subject");

    }

  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="text-blue-600" /> Manage Subjects
      </h1>

      {/* Select Class */}
      <div className="mb-6">

        <label className="block mb-2 font-semibold">
          Select Class
        </label>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-3 rounded-lg w-full max-w-xs"
        >

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}

        </select>

      </div>

      {/* Add Subject */}
      <div className="flex gap-3 mb-8 max-w-xl">

        <input
          type="text"
          placeholder="Enter subject name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        />

        <button
          onClick={handleAddSubject}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add
        </button>

      </div>

      {/* Subject List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {subjects.length === 0 && (
          <p className="text-gray-500">No subjects found</p>
        )}

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
              className="text-red-500 hover:text-red-700"
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