import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function ProductPreview({ fileUrl, title = "PDF Preview" }) {
  const [numPages, setNumPages] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState(false);

  // Fetch PDF and convert to blob
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlob(blobUrl);
      } catch (err) {
        console.error("PDF load error:", err);
        setError(true);
      }
    };

    if (fileUrl) loadPdf();
  }, [fileUrl]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!fileUrl) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center rounded-lg">
          <FileText size={70} className="text-blue-600" />
        </div>
        <p className="text-sm text-gray-500 mt-3 text-center">
          Preview not available
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-red-500 font-semibold">
          Failed to load PDF preview
        </p>
      </div>
    );
  }

  if (!pdfBlob) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-gray-500">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="overflow-auto max-h-[600px] flex flex-col items-center gap-4">
        <Document
          file={pdfBlob}
          onLoadSuccess={onLoadSuccess}
        >
          <Page pageNumber={1} width={450} />
          {numPages > 1 && <Page pageNumber={2} width={450} />}
        </Document>
      </div>

      <p className="text-sm text-gray-500 mt-3 text-center">
        {title} (First 2 pages preview)
      </p>
    </div>
  );
}

export default ProductPreview;