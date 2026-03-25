import React, { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import API from "../../services/api";

function ManageAcademics() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  /* ================= CLASSES ================= */
  const fetchClasses = async () => {
    try {

      const res = await API.get("/classes");

      const list = res.data?.data || res.data || [];

      setClasses(list);

      if (list.length > 0) {
        setSelectedClass(list[0]._id);
      }

    } catch (err) {

      setError("Failed to load classes");

    }
  };

  /* ================= SUBJECTS ================= */
  const fetchSubjects = async (classId) => {

    if (!classId) return;

    try {

      setLoading(true);

      const res = await API.get(`/subjects?classId=${classId}`);

      const list = res.data?.data || res.data || [];

      setSubjects(list);

    } catch (err) {

      setError("Failed to load subjects");

    } finally {
      setLoading(false);
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

  /* ================= ADD ================= */
  const addSubject = async () => {

    const name = newSubject.trim();

    if (!name) return;

    // 🔥 duplicate check
    const exists = subjects.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setError("Subject already exists");
      return;
    }

    try {

      setAdding(true);
      setError("");

      const res = await API.post("/subjects", {
        name,
        classId: selectedClass
      });

      const newItem = res.data?.data || { name, _id: Date.now() };

      // 🔥 optimistic update
      setSubjects((prev) => [...prev, newItem]);

      setNewSubject("");

    } catch (err) {

      setError(err.response?.data?.message || "Add failed");

    } finally {
      setAdding(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteSubject = async (id, name) => {

    if (!window.confirm(`Delete "${name}"?`)) return;

    try {

      await API.delete(`/subjects/${id}`);

      // 🔥 instant UI update
      setSubjects((prev) => prev.filter((s) => s._id !== id));

    } catch (err) {

      setError("Delete failed");

    }

  };

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Manage Subjects
      </h1>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* ================= SELECT CLASS ================= */}
      <div className="mb-6">

        <label className="block mb-2 font-semibold">
          Select Class
        </label>

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

      {/* ================= SUBJECT BOX ================= */}
      <div className="bg-white p-5 rounded-xl shadow">

        <div className="flex justify-between items-center mb-4">

          <h2 className="font-bold text-lg">
            Subjects
          </h2>

        </div>

        {/* ➕ ADD INPUT */}
        <div className="flex gap-2 mb-4">

          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Enter subject name"
            className="border p-2 rounded flex-1"
            onKeyDown={(e) => e.key === "Enter" && addSubject()}
          />

          <button
            onClick={addSubject}
            disabled={adding}
            className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1 disabled:opacity-60"
          >
            {adding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Plus size={16} /> Add
              </>
            )}
          </button>

        </div>

        {/* ================= LIST ================= */}

        {loading ? (

          <p className="text-gray-500">Loading...</p>

        ) : subjects.length === 0 ? (

          <p className="text-gray-500">No subjects found</p>

        ) : (

          <ul className="space-y-2">

            {subjects.map((sub) => (

              <li
                key={sub._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >

                {sub.name}

                <button
                  onClick={() => deleteSubject(sub._id, sub.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>

              </li>

            ))}

          </ul>

        )}

      </div>

    </div>

  );

}

export default ManageAcademics;