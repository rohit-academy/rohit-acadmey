import React, { useEffect, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import axios from "axios";

function UploadMaterial() {
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

  /* 🔐 Admin token */
  const token = localStorage.getItem("token");

  /* 📦 Load classes */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes");
        setClasses(res.data.data || res.data);
      } catch (err) {
        console.error("Class load error");
      }
    };
    fetchClasses();
  }, []);

  /* 📦 Load subjects when class changes */
  useEffect(() => {
    if (!formData.classId) return;

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`/api/subjects/class/${formData.classId}`);
        setSubjects(res.data.data || res.data);
      } catch (err) {
        console.error("Subject load error");
      }
    };

    fetchSubjects();
  }, [formData.classId]);

  /* 🧠 Handle input */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  /* 🚀 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      return alert("PDF required");
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("classId", formData.classId);
      data.append("subjectId", formData.subjectId);
      data.append("type", formData.type);
      data.append("pages", formData.pages);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("file", formData.file); // 🔥 backend expects "file"

      await axios.post("/api/materials", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Material uploaded successfully");

      /* 🔄 Reset form */
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

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
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
            className="border p-3 rounded-lg w-full"
          >
            <option value="">Select</option>
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
            className="border p-3 rounded-lg w-full"
          >
            <option value="">Select</option>
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
        <div>
          <label className="block mb-1 font-semibold">Material Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Pages */}
        <div>
          <label className="block mb-1 font-semibold">Total Pages</label>
          <input
            type="number"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-semibold">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block mb-2 font-semibold">Upload PDF</label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-xl cursor-pointer hover:bg-blue-50 transition">
            <FileText size={40} className="text-blue-600 mb-2" />
            <span className="text-gray-600">
              Click to upload or drag PDF file
            </span>
            <input
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

        {/* Submit */}
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
