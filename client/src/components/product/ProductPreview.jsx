import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

/* PDF worker */
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ProductPreview({ fileUrl, title = "PDF Preview" }) {

  const [numPages, setNumPages] = useState(null);

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

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <div className="overflow-auto max-h-[600px] flex flex-col items-center gap-4">

        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          loading={<p>Loading preview...</p>}
        >

          {/* Page 1 */}
          <Page pageNumber={1} width={450} />

          {/* Page 2 */}
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