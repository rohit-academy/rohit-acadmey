function ProductPreview({ previews, title }) {

  if (!previews || previews.length === 0) {
    return <p>No preview available</p>;
  }

  return (
    <div className="flex flex-col gap-4">

      {previews.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Preview ${i}`}
          className="rounded-lg shadow"
        />
      ))}

      <p className="text-sm text-gray-500 text-center">
        {title} (First 2 pages preview)
      </p>

    </div>
  );
}

export default ProductPreview;