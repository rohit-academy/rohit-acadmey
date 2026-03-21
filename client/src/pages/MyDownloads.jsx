import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import { useDownloads } from "../context/DownloadContext";
import { useAuth } from "../context/AuthContext";

function MyDownloads() {
  const navigate = useNavigate();

  const { downloads = [] } = useDownloads();
  const { user } = useAuth();

  /* 🔒 NOT LOGGED IN */
  if (!user) {
    navigate("/login");
    return null;
  }

  /* 🧠 IDENTIFIER FIX (🔥 IMPORTANT) */
  const userIdentifier = user.phone || user.email;

  /* 📦 FILTER DOWNLOADS */
  const userDownloads = downloads
    .filter(
      (item) =>
        item.userPhone === user.phone ||   // 📱 phone user
        item.userEmail === user.email      // 📧 google user
    )
    .sort((a, b) => b.id - a.id);

  const handleDownload = (item) => {
    // 🔗 future: real download URL
    alert(`Downloading: ${item.title}`);
  };

  return (
    <div className="px-4">

      <h1 className="text-3xl font-bold text-center mb-2">
        My Downloads
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Files linked to <strong>{userIdentifier}</strong>
      </p>

      {userDownloads.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-xl shadow max-w-lg mx-auto">
          <FileText className="mx-auto text-gray-400 mb-3" size={40} />

          <p className="text-gray-600 mb-2 font-semibold">
            No purchases yet
          </p>

          <p className="text-sm text-gray-500">
            Buy study materials to access downloads here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {userDownloads.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                <FileText className="text-blue-600 mb-1" size={24} />
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600">
                  {item.pages} pages
                </p>
              </div>

              <button
                onClick={() => handleDownload(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <Download size={16} /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDownloads;