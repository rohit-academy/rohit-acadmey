import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function ProductPreview({ fileUrl, title = "PDF Preview" }) {

  const [numPages, setNumPages] = useState(null);

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

  // 🔥 convert raw → previewable pdf
  const pdfUrl = fileUrl.replace("/raw/upload/", "/image/upload/fl_attachment/");

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <div className="overflow-auto max-h-[600px] flex flex-col items-center gap-4">

        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          loading={<p>Loading preview...</p>}
          error={<p className="text-red-500">Failed to load PDF file.</p>}
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