import React from "react";
import { Link } from "react-router-dom";
import { FileText, Star, Download } from "lucide-react";

function ProductCard({ id, title, type, pages, price, rating = 4.5 }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between border border-gray-100">

      {/* TOP CONTENT */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FileText className="text-blue-600" size={28} />

          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
            <Star size={14} fill="currentColor" />
            {rating}
          </div>
        </div>

        <h2 className="font-semibold text-lg leading-tight">{title}</h2>

        <div className="text-sm text-gray-600 mt-2 space-y-1">
          <p>📘 Type: <span className="font-medium">{type}</span></p>
          <p>📄 Pages: <span className="font-medium">{pages}</span></p>
          <p className="text-green-600 font-medium">⚡ Instant Download</p>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="mt-5">
        <p className="text-2xl font-bold text-blue-600 mb-3">₹{price}</p>

        <Link
          to={`/product/${id}`}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Download size={16} /> View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
