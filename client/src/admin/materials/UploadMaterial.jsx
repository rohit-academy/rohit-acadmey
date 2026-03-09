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
    file: null
  });

  const token = JSON.parse(localStorage.getItem("admin") || "{}")?.token;

  /* 🔐 Redirect if admin not logged */
  useEffect(() => {

    if (!token) {
      alert("Admin login required");
      navigate("/admin-login");
    }

  }, [token, navigate]);


  /* 📚 LOAD CLASSES */
  useEffect(() => {

    const fetchClasses = async () => {

      try {

        const res = await API.get("/classes");

        const classList =
          res.data?.data ||
          res.data?.classes ||
          res.data ||
          [];

        setClasses(classList);

      } catch (error) {

        console.error("Class fetch error:", error);

        setClasses([]);

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

        const subjectList =
          res.data?.data ||
          res.data ||
          [];

        setSubjects(subjectList);

      } catch (error) {

        console.error("Subject fetch error:", error);

        setSubjects([]);

      }

    };

    fetchSubjects();

  }, [formData.classId]);


  /* 🧠 Handle Input */
  const handleChange = (e) => {

    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

  };


  /* 🚀 Upload Material */
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.file) {
      alert("PDF required");
      return;
    }

    if (!formData.classId || !formData.subjectId || !formData.type) {
      alert("Fill all required fields");
      return;
    }

    try {

      setLoading(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {

        if (value) {
          data.append(key, value);
        }

      });

      await API.post("/materials", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Material uploaded successfully");

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

      navigate("/admin/materials");

    } catch (error) {

      console.error("Upload error:", error);

      alert(
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

          <option value="">
            Select Class
          </option>

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

          <option value="">
            Select Subject
          </option>

          {subjects.map((sub) => (

            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>

          ))}

        </select>


        {/* MATERIAL TYPE */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        >

          <option value="">
            Material Type
          </option>

          <option value="Notes">
            Notes
          </option>

          <option value="Sample Paper">
            Sample Paper
          </option>

          <option value="PYQ">
            PYQ
          </option>

          <option value="Assignment">
            Assignment
          </option>

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
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition text-lg font-semibold"
        >

          {loading
            ? "Uploading..."
            : "Upload Material"}

        </button>

      </form>

    </div>

  );

}

export default UploadMaterial;