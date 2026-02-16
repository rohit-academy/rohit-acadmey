import React, { useEffect, useState, useRef } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

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

  const token = JSON.parse(localStorage.getItem("admin") || "{}")?.token;

  /* 🔐 Redirect if not logged in */
  useEffect(() => {
    if (!token) {
      alert("Admin login required");
      navigate("/admin-login");
    }
  }, [token, navigate]);

  /* 📦 LOAD CLASSES */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");

        console.log("CLASSES API RESPONSE:", res.data); // 🧪 DEBUG

        // 🔥 handle all formats
        if (res.data?.success && Array.isArray(res.data.data)) {
          setClasses(res.data.data);
        } else if (Array.isArray(res.data)) {
          setClasses(res.data);
        } else if (Array.isArray(res.data?.classes)) {
          setClasses(res.data.classes);
        } else {
          setClasses([]);
        }
      } catch (err) {
        console.error("Class load error:", err.response?.data || err.message);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  /* 📦 LOAD SUBJECTS */
  useEffect(() => {
    if (!formData.classId) {
      setSubjects([]);
      setFormData((prev) => ({ ...prev, subjectId: "" }));
      return;
    }

    const fetchSubjects = async () => {
      try {
        const res = await API.get(`/subjects/class/${formData.classId}`);

        console.log("SUBJECTS API RESPONSE:", res.data); // 🧪 DEBUG

        if (res.data?.success && Array.isArray(res.data.data)) {
          setSubjects(res.data.data);
        } else if (Array.isArray(res.data)) {
          setSubjects(res.data);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        console.error("Subject load error:", err.response?.data || err.message);
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

    if (!formData.file) return alert("PDF required");
    if (!formData.classId || !formData.subjectId || !formData.type) {
      return alert("All required fields fill karo");
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await API.post("/materials", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Material uploaded successfully");

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

      navigate("/admin/materials");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
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
        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          required
          disabled={loading}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Select Class</option>

          {classes.length === 0 && (
            <option disabled>No classes found</option>
          )}

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          required
          disabled={!formData.classId || loading}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Select Subject</option>

          {subjects.length === 0 && formData.classId && (
            <option disabled>No subjects found</option>
          )}

          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          disabled={loading}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Material Type</option>
          <option value="Notes">Notes</option>
          <option value="Sample Paper">Sample Paper</option>
          <option value="PYQ">PYQ</option>
          <option value="Assignment">Assignment</option>
        </select>

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
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-xl cursor-pointer hover:bg-blue-50 transition">
          <FileText size={40} className="text-blue-600 mb-2" />
          <span className="text-gray-600">Click to upload PDF</span>
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
          <p className="text-sm text-green-600">
            Selected: {formData.file.name}
          </p>
        )}

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
