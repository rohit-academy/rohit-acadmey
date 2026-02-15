import React, { useEffect, useState } from "react";
import { Trash2, Pencil, FileText } from "lucide-react";

function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // 🔐 Admin token

  /* 📦 FETCH MATERIALS */
  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      const data = await res.json();

      if (data.success) {
        setMaterials(data.data);
      }
    } catch (error) {
      console.error("Fetch materials error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  /* ❌ DELETE MATERIAL */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;

    try {
      const res = await fetch(`/api/materials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setMaterials(materials.filter((m) => m._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading materials...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Manage Study Materials
      </h1>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Class</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Type</th>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {materials.map((m) => (
              <tr key={m._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{m.classId?.name}</td>
                <td className="p-3">{m.subjectId?.name}</td>
                <td className="p-3">{m.type}</td>

                <td className="p-3 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  {m.title}
                </td>

                <td className="p-3 font-semibold text-blue-600">
                  ₹{m.price}
                </td>

                <td className="p-3 flex justify-center gap-4">
                  {/* ✏ EDIT — Next step me modal banayenge */}
                  <button className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>

                  {/* ❌ DELETE */}
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">
        {materials.map((m) => (
          <div key={m._id} className="bg-white shadow rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-blue-600">
              <FileText size={18} />
              {m.title}
            </div>

            <div className="text-sm text-gray-600">
              Class: <span className="font-medium">{m.classId?.name}</span>
            </div>

            <div className="text-sm text-gray-600">
              Subject: <span className="font-medium">{m.subjectId?.name}</span>
            </div>

            <div className="text-sm text-gray-600">
              Type: <span className="font-medium">{m.type}</span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-blue-600">₹{m.price}</span>

              <div className="flex gap-4">
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(m._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageMaterials;
