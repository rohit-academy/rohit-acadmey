import React from "react";

function ProductPreview({
  previews = [],
  thumbnail = "",
  title = "Preview"
}) {

  /* 🖼 THUMBNAIL PRIORITY */

  if (thumbnail) {
    return (

      <div className="flex flex-col gap-3">

        <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200">

          <img
            src={thumbnail}
            alt="Thumbnail"
            loading="lazy"
            className="w-full h-[350px] object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x500?text=Thumbnail+Unavailable";
            }}
          />

          {/* overlay badge */}
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Preview
          </div>

        </div>

        <p className="text-sm text-gray-500 text-center">
          {title}
        </p>

      </div>

    );
  }

  /* ❌ NO PREVIEW */

  if (!previews || previews.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-xl border border-gray-200">
        <p className="text-gray-400 text-sm">
          Preview not available
        </p>
      </div>
    );
  }

  /* 📄 PREVIEW IMAGES FALLBACK */

  return (

    <div className="flex flex-col gap-4">

      {previews.slice(0, 2).map((img, i) => (

        <div
          key={i}
          className="overflow-hidden rounded-lg shadow-md border border-gray-200"
        >

          <img
            src={img}
            alt={`Preview page ${i + 1}`}
            loading="lazy"
            className="w-full transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x500?text=Preview+Unavailable";
            }}
          />

        </div>

      ))}

      <p className="text-sm text-gray-500 text-center">
        {title} (First 2 pages preview)
      </p>

    </div>

  );

}

export default ProductPreview;