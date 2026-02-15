import React, { useEffect, useState, useRef } from "react";
import { UploadCloud, FileText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadMaterial() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    classId: "",
    subjectId: "",
    type: "",
    title: "",
    pages: "",
    price: "",
    description: "",
    file: null,
  });

  /* 🔐 Safe token */
  const adminData = JSON.parse(localStorage.getItem("admin"));
  const token = adminData?.token;

  /* 🚫 Not logged in */
  useEffect(() => {
    if (!token) {
      alert("Admin login required");
      navigate("/admin-login");
    }
  }, [token, navigate]);

  /* 📦 Load classes */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes");
        const data = res.data?.data || res.data;

        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          setClasses([]);
        }
      } catch (err) {
        console.error("Class load error:", err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  /* 📦 Load subjects */
  useEffect(() => {
    if (!formData.classId) {
      setSubjects([]);
      setFormData((prev) => ({ ...prev, subjectId: "" }));
      return;
    }

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `/api/subjects/class/${formData.classId}`
        );

        const data = res.data?.data || res.data;

        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        console.error("Subject load error:", err);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [formData.classId]);

  /* 🧠 Handle input */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* 🚀 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    if (!formData.file) {
      return alert("PDF required");
    }

    if (!formData.classId || !formData.subjectId || !formData.type) {
      return alert("All required fields fill karo");
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await axios.post("/api/materials", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Material uploaded successfully");

      /* 🔄 Reset */
      setFormData({
        classId: "",
        subjectId: "",
        type: "",
        title: "",
        pages: "",
        price: "",
        description: "",
        file: null,
      });

      setSubjects([]);

      if (fileRef.current) fileRef.current.value = "";

      /* 🔁 Redirect */
      navigate("/admin/materials");

    } catch (err) {
      console.error("Upload error:", err);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UploadCloud className="text-blue-600" /> Upload Study Material
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        {/* Class */}
        <div>
          <label className="block mb-1 font-semibold">Select Class</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-3 rounded-lg w-full"
          >
            <option value="">Select</option>
            {classes.length === 0 && (
              <option disabled>No classes found</option>
            )}
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-1 font-semibold">Select Subject</label>
          <select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            required
            disabled={!formData.classId || loading}
            className="border p-3 rounded-lg w-full"
          >
            <option value="">Select</option>
            {subjects.length === 0 && formData.classId && (
              <option disabled>No subjects found</option>
            )}
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 font-semibold">Material Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-3 rounded-lg w-full"
          >
            <option value="">Select</option>
            <option value="Notes">Notes</option>
            <option value="Sample Paper">Sample Paper</option>
            <option value="PYQ">PYQ</option>
            <option value="Assignment">Assignment</option>
          </select>
        </div>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Material Title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
          className="border p-3 rounded-lg w-full"
        />

        {/* Pages */}
        <input
          type="number"
          name="pages"
          placeholder="Total Pages"
          value={formData.pages}
          onChange={handleChange}
          disabled={loading}
          className="border p-3 rounded-lg w-full"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price ₹"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={loading}
          className="border p-3 rounded-lg w-full"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          disabled={loading}
          className="border p-3 rounded-lg w-full"
        />

        {/* PDF Upload */}
        <div>
          <label className="block mb-2 font-semibold">Upload PDF</label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-xl cursor-pointer hover:bg-blue-50 transition">
            <FileText size={40} className="text-blue-600 mb-2" />
            <span className="text-gray-600">
              Click to upload or drag PDF file
            </span>
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
              required
            />
          </label>

          {formData.file && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {formData.file.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition text-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Material"}
        </button>
      </form>
    </div>
  );
}

export default UploadMaterial;
