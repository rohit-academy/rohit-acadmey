import React, { useEffect, useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function UploadMaterial() {

  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
    file: null
  });

  const token = JSON.parse(localStorage.getItem("admin") || "{}")?.token;

  /* 🔐 Redirect if admin not logged */

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, [token, navigate]);

  /* 📚 LOAD CLASSES */

  useEffect(() => {

    const fetchClasses = async () => {

      try {

        const res = await API.get("/classes");

        setClasses(
          res.data?.data ||
          res.data ||
          []
        );

      } catch (error) {

        console.error("Class fetch error:", error);

      }

    };

    fetchClasses();

  }, []);

  /* 📄 LOAD SUBJECTS */

  useEffect(() => {

    if (!formData.classId) {

      setSubjects([]);

      setFormData((prev) => ({
        ...prev,
        subjectId: ""
      }));

      return;

    }

    const fetchSubjects = async () => {

      try {

        const res = await API.get(
          `/subjects?classId=${formData.classId}`
        );

        setSubjects(
          res.data?.data ||
          res.data ||
          []
        );

      } catch (error) {

        console.error("Subject fetch error:", error);

      }

    };

    fetchSubjects();

  }, [formData.classId]);

  /* INPUT HANDLER */

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

  };

  /* 🚀 UPLOAD MATERIAL */

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

      await API.post(
        "/materials",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },

          onUploadProgress: (progressEvent) => {

            const percent = Math.round(
              (progressEvent.loaded * 100) /
              progressEvent.total
            );

            setProgress(percent);

          }

        }
      );

      setSuccess(true);

      /* reset form */

      setFormData({
        classId: "",
        subjectId: "",
        type: "",
        title: "",
        pages: "",
        price: "",
        description: "",
        file: null
      });

      setSubjects([]);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      /* redirect */

      setTimeout(() => {
        navigate("/admin/materials");
      }, 1200);

    } catch (error) {

      console.error("Upload error:", error);

      setError(
        error.response?.data?.message ||
        "Material upload failed"
      );

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

      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          Material uploaded successfully
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* PROGRESS BAR */}

      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >

        {/* CLASS */}

        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        >
          <option value="">Select Class</option>

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}

        </select>

        {/* SUBJECT */}

        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
          disabled={!formData.classId}
        >

          <option value="">Select Subject</option>

          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}

        </select>

        {/* TYPE */}

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        >

          <option value="">Material Type</option>
          <option value="Notes">Notes</option>
          <option value="Sample Paper">Sample Paper</option>
          <option value="PYQ">PYQ</option>
          <option value="Assignment">Assignment</option>

        </select>

        {/* TITLE */}

        <input
          type="text"
          name="title"
          placeholder="Material Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        />

        {/* PAGES */}

        <input
          type="number"
          name="pages"
          placeholder="Total Pages"
          value={formData.pages}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        {/* PRICE */}

        <input
          type="number"
          name="price"
          placeholder="Price ₹"
          value={formData.price}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="border p-3 rounded-lg w-full"
        />

        {/* FILE UPLOAD */}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-xl cursor-pointer hover:bg-blue-50 transition">

          <FileText
            size={40}
            className="text-blue-600 mb-2"
          />

          <span className="text-gray-600">
            Click to upload PDF
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
          <p className="text-sm text-green-600">
            Selected: {formData.file.name}
          </p>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition text-lg font-semibold flex items-center justify-center gap-2"
        >

          {loading ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Uploading {progress}%
            </>
          ) : (
            "Upload Material"
          )}

        </button>

      </form>

    </div>

  );

}

export default UploadMaterial;