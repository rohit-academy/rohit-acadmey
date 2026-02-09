import React from "react";
import { FileText } from "lucide-react";

function ProductPreview({ title = "PDF Preview" }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center rounded-lg relative overflow-hidden">

        {/* Fake Page Stack Effect */}
        <div className="absolute w-[90%] h-[90%] bg-white shadow-md rounded-md rotate-2"></div>
        <div className="absolute w-[90%] h-[90%] bg-white shadow-md rounded-md -rotate-2"></div>

        {/* Icon */}
        <FileText size={70} className="text-blue-600 relative z-10" />
      </div>

      <p className="text-sm text-gray-500 mt-3 text-center">
        {title} (First 2 pages)
      </p>
    </div>
  );
}

export default ProductPreview;
