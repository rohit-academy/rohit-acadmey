import React, { createContext, useContext, useState, useEffect } from "react";

const DownloadContext = createContext();

export function DownloadProvider({ children }) {
  const [downloads, setDownloads] = useState([]);

  // 🔹 Load from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem("downloads");
    if (saved) setDownloads(JSON.parse(saved));
  }, []);

  // 🔹 Add new downloadable file
  const addDownload = (product) => {
    setDownloads((prev) => {
      const updated = [...prev, product];
      localStorage.setItem("downloads", JSON.stringify(updated));
      return updated;
    });
  };

  // 🔹 (Future) remove or clear
  const clearDownloads = () => {
    setDownloads([]);
    localStorage.removeItem("downloads");
  };

  return (
    <DownloadContext.Provider value={{ downloads, addDownload, clearDownloads }}>
      {children}
    </DownloadContext.Provider>
  );
}

export const useDownloads = () => useContext(DownloadContext);
