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

  /* ===============================
     🔐 ADMIN CHECK (SAFE)
  ============================== */
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    if (!admin?.token) navigate("/admin-login");
  }, [navigate]);

  /* ===============================
     📚 FETCH CLASSES
  ============================== */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data?.data || res.data || []);
      } catch {
        setError("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  /* ===============================
     📄 FETCH SUBJECTS
  ============================== */
  useEffect(() => {

    if (!formData.classId) {
      setSubjects([]);
      return;
    }

    const fetchSubjects = async () => {
      try {
        const res = await API.get(`/subjects?classId=${formData.classId}`);
        setSubjects(res.data?.data || res.data || []);
      } catch {
        setError("Failed to load subjects");
      }
    };

    fetchSubjects();

  }, [formData.classId]);

  /* ===============================
     INPUT HANDLER
  ============================== */
  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {

      const file = files[0];

      // ✅ FILE SIZE CHECK (10MB PDF / 2MB image)
      if (name === "file" && file.size > 10 * 1024 * 1024) {
        setError("PDF must be under 10MB");
        return;
      }

      if (name === "thumbnail" && file.size > 2 * 1024 * 1024) {
        setError("Thumbnail must be under 2MB");
        return;
      }

      // ✅ preview cleanup
      if (name === "thumbnail") {
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(URL.createObjectURL(file));
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ===============================
     🚀 SUBMIT
  ============================== */
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    // ✅ VALIDATION
    if (!formData.title || !formData.price || !formData.type) {
      setError("Fill all required fields");
      return;
    }

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
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      await API.post("/materials", data, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });

      setSuccess(true);

      // ✅ RESET
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

      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
      }

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

  /* =============================== UI =============================== */

  return (

    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
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
        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow space-y-4">

        <select name="classId" value={formData.classId} onChange={handleChange} className="input" required>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="input" required>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select name="type" value={formData.type} onChange={handleChange} className="input" required>
          <option value="">Type</option>
          <option value="Notes">Notes</option>
          <option value="PYQ">PYQ</option>
        </select>

        <input name="title" value={formData.title} placeholder="Title" onChange={handleChange} className="input" required />
        <input name="price" value={formData.price} type="number" placeholder="Price" onChange={handleChange} className="input" required />

        <div className="grid sm:grid-cols-2 gap-4">

          <label className="upload-box hover:border-blue-400">
            <FileText className="text-blue-600" />
            <span>Upload PDF</span>
            <input ref={fileRef} type="file" name="file" accept=".pdf" onChange={handleChange} hidden />
          </label>

          <label className="upload-box hover:border-green-400">
            <Image className="text-green-600" />
            <span>Thumbnail</span>
            <input ref={thumbRef} type="file" name="thumbnail" accept="image/*" onChange={handleChange} hidden />
          </label>

        </div>

        {formData.file && (
          <p className="text-green-600 text-sm">{formData.file.name}</p>
        )}

        {thumbnailPreview && (
          <img src={thumbnailPreview} className="w-full h-40 object-cover rounded-lg" />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {loading ? `Uploading ${progress}%` : "Upload Material"}
        </button>

      </form>

    </div>

  );

}

export default UploadMaterial;