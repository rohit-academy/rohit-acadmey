import React, { useEffect, useState } from "react";
import { Plus, Trash2, BookOpen, Loader2 } from "lucide-react";
import API from "../../services/api";

function ManageSubjects() {

  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     📚 LOAD CLASSES
  ========================= */
  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      const list = res.data?.data || [];

      setClasses(list);

      if (list.length > 0) {
        setSelectedClass(list[0]._id);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load classes");
    }
  };

  /* =========================
     🌿 LOAD STREAMS
  ========================= */
  const fetchStreams = async (classId) => {
    try {

      const res = await API.get(`/streams?classId=${classId}`);
      const list = res.data?.data || [];

      setStreams(list);

      if (list.length > 0) {
        setSelectedStream(list[0]._id);
      } else {
        setSelectedStream("");
      }

    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     📄 LOAD SUBJECTS
  ========================= */
  const fetchSubjects = async (classId, streamId) => {
    try {

      setLoading(true);

      let url = `/subjects?classId=${classId}`;

      if (streamId) {
        url += `&streamId=${streamId}`;
      }

      const res = await API.get(url);
      const list = res.data?.data || [];

      const sorted = list.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setSubjects(sorted);

    } catch (err) {
      console.error(err);
      setError("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {

    if (!selectedClass) return;

    const cls = classes.find(c => c._id === selectedClass);

    if (cls?.requiresStream) {
      fetchStreams(selectedClass);
    } else {
      setStreams([]);
      setSelectedStream("");
    }

  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass, selectedStream);
    }
  }, [selectedClass, selectedStream]);

  /* =========================
     ➕ ADD SUBJECT
  ========================= */
  const handleAddSubject = async () => {

    const name = newSubject.trim();

    if (!name) return;

    const cls = classes.find(c => c._id === selectedClass);

    /* 🔥 STREAM REQUIRED CHECK */
    if (cls?.requiresStream && !selectedStream) {
      setError("Stream required for this class");
      return;
    }

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

      await API.post("/subjects", {
        name,
        classId: selectedClass,
        streamId: cls?.requiresStream ? selectedStream : null
      });

      setNewSubject("");

      fetchSubjects(selectedClass, selectedStream);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Add failed");
    } finally {
      setAdding(false);
    }
  };

  /* =========================
     ❌ DELETE SUBJECT
  ========================= */
  const handleDelete = async (id, name) => {

    if (!window.confirm(`Delete "${name}"?`)) return;

    try {

      await API.delete(`/subjects/${id}`);

      setSubjects((prev) =>
        prev.filter((s) => s._id !== id)
      );

    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  /* =========================
     UI
  ========================= */
  const selectedClassObj = classes.find(c => c._id === selectedClass);

  return (

    <div className="p-4 md:p-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="text-blue-600" /> Manage Subjects
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* ================= CLASS SELECT ================= */}
      <div className="mb-4">

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
              Class {cls.name}
            </option>
          ))}
        </select>

      </div>

      {/* ================= STREAM SELECT ================= */}
      {selectedClassObj?.requiresStream && (

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Select Stream
          </label>

          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="border p-3 rounded-lg w-full max-w-xs"
          >
            <option value="">Select Stream</option>

            {streams.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}

          </select>

        </div>

      )}

      {/* ================= ADD ================= */}
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
          disabled={adding}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2"
        >
          {adding ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Plus size={18} /> Add
            </>
          )}
        </button>

      </div>

      {/* ================= SUBJECT LIST ================= */}
      {loading ? (

        <div className="text-center py-10 text-gray-500">
          Loading subjects...
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {subjects.length === 0 ? (
            <p className="text-gray-500">
              No subjects found
            </p>
          ) : (

            subjects.map((subject) => (

              <div
                key={subject._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >

                <span className="font-semibold text-lg">
                  {subject.name}
                </span>

                <button
                  onClick={() =>
                    handleDelete(subject._id, subject.name)
                  }
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))

          )}

        </div>

      )}

    </div>

  );

}

export default ManageSubjects;