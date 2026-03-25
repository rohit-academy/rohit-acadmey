import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Loader from "../components/ui/Loader";

function MyDownloads() {

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔒 AUTH CHECK */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  /* 📦 FETCH FROM BACKEND (🔥 SECURE) */
  useEffect(() => {

    let isMounted = true;

    const fetchDownloads = async () => {
      try {

        setLoading(true);
        setError("");

        const res = await API.get("/orders/my-materials");

        if (!isMounted) return;

        setDownloads(res.data?.data || []);

      } catch (err) {

        if (!isMounted) return;

        console.error("Download fetch error:", err);
        setError("Failed to load downloads");

      } finally {

        if (isMounted) setLoading(false);

      }
    };

    if (user) fetchDownloads();

    return () => {
      isMounted = false;
    };

  }, [user]);

  /* ⏳ LOADING */
  if (authLoading || loading) return <Loader />;

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-red-600 font-bold mb-3">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ❌ EMPTY */
  if (!downloads.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-xl shadow text-center max-w-lg">

          <FileText size={40} className="mx-auto text-gray-400 mb-4" />

          <h2 className="font-semibold text-lg mb-2">
            No purchases yet
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Buy study materials to unlock downloads.
          </p>

          <button
            onClick={() => navigate("/classes")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Materials
          </button>

        </div>
      </div>
    );
  }

  /* ⬇ DOWNLOAD */
  const handleDownload = (item) => {

    if (!item.fileUrl) {
      alert("Download link not available");
      return;
    }

    // 🔥 better than window.open
    const link = document.createElement("a");
    link.href = item.fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (

    <div className="min-h-screen bg-slate-50 px-4 py-6">

      {/* HEADER */}
      <div className="text-center mb-8">

        <h1 className="text-3xl font-bold">
          My Downloads
        </h1>

        <p className="text-gray-500 mt-2">
          Your purchased materials
        </p>

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {downloads.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={
                item.thumbnail ||
                item.previewImages?.[0] ||
                "https://via.placeholder.com/400x250?text=PDF"
              }
              alt={item.title}
              className="w-full h-40 object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="font-semibold line-clamp-2 mb-2">
                {item.title}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {item.pages || 0} pages • {item.type}
              </p>

              <button
                onClick={() => handleDownload(item)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <Download size={16} />
                Download
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default MyDownloads;