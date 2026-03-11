import React from "react";
import { FileText } from "lucide-react";

function ProductPreview({ fileUrl, title = "PDF Preview" }) {

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

  /* 🔥 Cloudinary preview images */
  const page1 = fileUrl
    .replace("/raw/upload/", "/image/upload/pg_1/")
    + ".pdf";

  const page2 = fileUrl
    .replace("/raw/upload/", "/image/upload/pg_2/")
    + ".pdf";

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <div className="flex flex-col items-center gap-4">

        <img
          src={page1}
          alt="Preview page 1"
          className="rounded-lg shadow max-h-[500px]"
        />

        <img
          src={page2}
          alt="Preview page 2"
          className="rounded-lg shadow max-h-[500px]"
        />

      </div>

      <p className="text-sm text-gray-500 mt-3 text-center">
        {title} (First 2 pages preview)
      </p>

    </div>

  );

}

export default ProductPreview;