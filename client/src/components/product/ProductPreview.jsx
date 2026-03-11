import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function ProductPreview({ fileUrl, title = "PDF Preview" }) {

  const [numPages, setNumPages] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {

    const loadPdf = async () => {

      try {

        const response = await fetch(fileUrl);
        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        setPdfBlob(blobUrl);

      } catch (error) {

        console.error("PDF load error:", error);

      }

    };

    if (fileUrl) {
      loadPdf();
    }

  }, [fileUrl]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

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

          {numPages > 1 && (
            <Page pageNumber={2} width={450} />
          )}

        </Document>

      </div>

      <p className="text-sm text-gray-500 mt-3 text-center">
        {title} (First 2 pages preview)
      </p>

    </div>

  );

}

export default ProductPreview;