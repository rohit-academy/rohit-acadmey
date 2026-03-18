import React, { useEffect, useState, useRef } from "react";
import { UploadCloud, FileText, Image, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function UploadMaterial() {

  const navigate = useNavigate();
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

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
    thumbnail: null
  });

  const token = JSON.parse(localStorage.getItem("admin") || "{}")?.token;

  /* 🔐 Redirect */
  useEffect(() => {
    if (!token) navigate("/admin-login");
  }, [token, navigate]);

  /* 📚 Classes */
  useEffect(() => {
    API.get("/classes").then(res => {
      setClasses(res.data?.data || res.data || []);
    });
  }, []);

  /* 📄 Subjects */
  useEffect(() => {

    if (!formData.classId) {
      setSubjects([]);
      return;
    }

    API.get(`/subjects?classId=${formData.classId}`)
      .then(res => {
        setSubjects(res.data?.data || res.data || []);
      });

  }, [formData.classId]);

  /* INPUT */
  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (name === "thumbnail" && files?.[0]) {
      setThumbnailPreview(URL.createObjectURL(files[0]));
    }

    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

  };

  /* 🚀 SUBMIT */
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.file) {
      setError("PDF required");
      return;
    }

    try {

      setLoading(true);
      setProgress(0);
      setError("");
      setSuccess(false);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await API.post("/materials", data, {

        headers: {
          "Content-Type": "multipart/form-data"
        },

        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }

      });

      setSuccess(true);

      setFormData({
        classId: "",
        subjectId: "",
        type: "",
        title: "",
        pages: "",
        price: "",
        description: "",
        file: null,
        thumbnail: null
      });

      setThumbnailPreview(null);

      if (fileRef.current) fileRef.current.value = "";
      if (thumbRef.current) thumbRef.current.value = "";

      setTimeout(() => {
        navigate("/admin/materials");
      }, 1200);

    } catch (err) {

      setError(err.response?.data?.message || "Upload failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UploadCloud className="text-blue-600" />
        Upload Study Material
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 flex gap-2 items-center">
          <CheckCircle size={18} /> Uploaded successfully
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-5">

        {/* CLASS */}
        <select name="classId" value={formData.classId} onChange={handleChange} className="border p-3 rounded-lg w-full" required>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        {/* SUBJECT */}
        <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="border p-3 rounded-lg w-full" required>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        {/* TYPE */}
        <select name="type" value={formData.type} onChange={handleChange} className="border p-3 rounded-lg w-full" required>
          <option value="">Type</option>
          <option value="Notes">Notes</option>
          <option value="PYQ">PYQ</option>
        </select>

        <input name="title" placeholder="Title" onChange={handleChange} className="border p-3 rounded-lg w-full" required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} className="border p-3 rounded-lg w-full" required />

        {/* PDF */}
        <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer hover:bg-blue-50">
          <FileText className="mx-auto mb-2 text-blue-600" />
          Upload PDF
          <input ref={fileRef} type="file" name="file" accept=".pdf" onChange={handleChange} hidden />
        </label>

        {formData.file && <p className="text-green-600 text-sm">{formData.file.name}</p>}

        {/* 🖼 THUMBNAIL */}
        <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer hover:bg-green-50">

          <Image className="mx-auto mb-2 text-green-600" />

          Upload Thumbnail (optional)

          <input
            ref={thumbRef}
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            hidden
          />

        </label>

        {/* PREVIEW */}
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            className="w-full h-40 object-cover rounded-lg shadow"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold"
        >
          {loading ? `Uploading ${progress}%` : "Upload Material"}
        </button>

      </form>

    </div>

  );

}

export default UploadMaterial;