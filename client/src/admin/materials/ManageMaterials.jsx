import React, { useEffect, useState } from "react";
import { Trash2, Pencil, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function ManageMaterials() {

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  /* ===============================
     📦 FETCH MATERIALS
  ============================== */
  const fetchMaterials = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await API.get("/materials?admin=true");

      const data = res.data?.data || res.data || [];

      // ✅ latest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMaterials(sorted);

    } catch (err) {

      console.error("Fetch error:", err);
      setError("Failed to load materials");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  /* ===============================
     ❌ DELETE
  ============================== */
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this material?")) return;

    try {

      setDeletingId(id);

      await API.delete(`/materials/${id}`);

      setMaterials(prev => prev.filter(m => m._id !== id));

    } catch (err) {

      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Delete failed");

    } finally {

      setDeletingId(null);

    }

  };

  /* ===============================
     💰 FORMAT
  ============================== */
  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  /* ===============================
     ⏳ LOADING
  ============================== */
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Manage Study Materials
        </h1>

        <div className="flex gap-2">

          <button
            onClick={fetchMaterials}
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 text-sm"
          >
            Refresh
          </button>

          <button
            onClick={() => navigate("/admin/materials/upload")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} /> Upload
          </button>

        </div>

      </div>

      {/* ❌ ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {materials.length === 0 && !error && (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No materials found. Click <b>Upload</b> to add new PDF.
        </div>
      )}

      {/* ================= DESKTOP ================= */}
      {materials.length > 0 && (

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

                  <td className="p-3">{m.classId?.name || "-"}</td>
                  <td className="p-3">{m.subjectId?.name || "-"}</td>
                  <td className="p-3">{m.type}</td>

                  <td className="p-3 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    {m.title}
                  </td>

                  <td className="p-3 font-semibold text-blue-600">
                    {formatPrice(m.price)}
                  </td>

                  <td className="p-3 flex justify-center gap-4">

                    <button
                      onClick={() => navigate(`/admin/materials/edit/${m._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      disabled={deletingId === m._id}
                      onClick={() => handleDelete(m._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {deletingId === m._id ? "..." : <Trash2 size={18} />}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* ================= MOBILE ================= */}
      <div className="grid gap-4 md:hidden">

        {materials.map((m) => (

          <div key={m._id} className="bg-white shadow rounded-xl p-4 space-y-2">

            <div className="flex items-center gap-2 font-semibold text-blue-600">
              <FileText size={18} />
              {m.title}
            </div>

            <div className="text-sm text-gray-600">
              Class: <span className="font-medium">{m.classId?.name || "-"}</span>
            </div>

            <div className="text-sm text-gray-600">
              Subject: <span className="font-medium">{m.subjectId?.name || "-"}</span>
            </div>

            <div className="text-sm text-gray-600">
              Type: <span className="font-medium">{m.type}</span>
            </div>

            <div className="flex justify-between items-center mt-3">

              <span className="font-bold text-blue-600">
                {formatPrice(m.price)}
              </span>

              <div className="flex gap-4">

                <button
                  onClick={() => navigate(`/admin/materials/edit/${m._id}`)}
                  className="text-blue-600"
                >
                  <Pencil size={18} />
                </button>

                <button
                  disabled={deletingId === m._id}
                  onClick={() => handleDelete(m._id)}
                  className="text-red-500"
                >
                  {deletingId === m._id ? "..." : <Trash2 size={18} />}
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