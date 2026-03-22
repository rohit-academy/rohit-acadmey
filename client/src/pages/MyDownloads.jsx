import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import { useDownloads } from "../context/DownloadContext";
import { useAuth } from "../context/AuthContext";

function MyDownloads() {

  const navigate = useNavigate();
  const { downloads = [] } = useDownloads();
  const { user } = useAuth();

  /* 🔒 REDIRECT FIX */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const userIdentifier = user.phone || user.email;

  /* 📦 FILTER */
  const userDownloads = downloads
    .filter(
      (item) =>
        item.userPhone === user.phone ||
        item.userEmail === user.email
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* ⬇ DOWNLOAD */
  const handleDownload = (item) => {

    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank");
    } else {
      alert("Download link not available");
    }

  };

  return (

    <div className="min-h-screen bg-slate-50 px-4 py-6">

      {/* HEADER */}
      <div className="text-center mb-8">

        <h1 className="text-3xl font-bold">
          My Downloads
        </h1>

        <p className="text-gray-500 mt-2">
          Files linked to <strong>{userIdentifier}</strong>
        </p>

      </div>

      {/* EMPTY */}
      {userDownloads.length === 0 ? (

        <div className="bg-white p-10 rounded-xl shadow text-center max-w-lg mx-auto">

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

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {userDownloads.map((item) => (

            <div
              key={item._id || item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >

              {/* 🖼 THUMBNAIL */}
              <img
                src={
                  item.thumbnail ||
                  item.previewImages?.[0] ||
                  "https://via.placeholder.com/400x250?text=PDF"
                }
                alt={item.title}
                className="w-full h-40 object-cover"
              />

              {/* 📄 CONTENT */}
              <div className="p-4">

                <h2 className="font-semibold line-clamp-2 mb-2">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500 mb-3">
                  {item.pages} pages • {item.type}
                </p>

                {/* ⬇ BUTTON */}
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

      )}

    </div>

  );

}

export default MyDownloads;