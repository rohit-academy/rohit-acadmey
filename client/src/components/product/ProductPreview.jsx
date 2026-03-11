import React from "react";

function ProductPreview({ previews = [], title = "Preview" }) {

  /* No preview */
  if (!previews || previews.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-lg">
        <p className="text-gray-400 text-sm">
          Preview not available
        </p>
      </div>
    );
  }

  return (

    <div className="flex flex-col gap-4">

      {/* show only first 2 preview images */}
      {previews.slice(0, 2).map((img, i) => (

        <img
          key={i}
          src={img}
          alt={`Preview page ${i + 1}`}
          loading="lazy"
          className="rounded-lg shadow-md border border-gray-200"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x500?text=Preview+Unavailable";
          }}
        />

      ))}

      <p className="text-sm text-gray-500 text-center">
        {title} (First 2 pages preview)
      </p>

    </div>

  );

}

export default ProductPreview;