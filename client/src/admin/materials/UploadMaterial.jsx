import React, { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

function UploadMaterial() {
  const [formData, setFormData] = useState({
    classId: "",
    stream: "",
    subject: "",
    title: "",
    price: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Material Upload Data:", formData);
    alert("Material Uploaded (backend se connect baad me hoga)");
  };

  const showStream = formData.classId === "11" || formData.classId === "12";

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
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>

        {/* Stream (only 11/12) */}
        {showStream && (
          <div>
            <label className="block mb-1 font-semibold">Select Stream</label>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg w-full"
            >
              <option value="">Select</option>
              <option value="pcb">PCB</option>
              <option value="pcm">PCM</option>
              <option value="arts">Arts</option>
            </select>
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="block mb-1 font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Material Title</label>
          <input
            type="text"
            name="title"
            required
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
            required
            onChange={handleChange}
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
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition text-lg font-semibold"
        >
          Upload Material
        </button>

      </form>
    </div>
  );
}

export default UploadMaterial;
