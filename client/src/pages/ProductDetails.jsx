import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Download, ArrowLeft, ShieldCheck } from "lucide-react";
import Loader from "../components/ui/Loader";
import ProductPreview from "../components/product/ProductPreview";
import RatingStars from "../components/product/RatingStars";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product);
    setTimeout(() => navigate("/cart"), 300);
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">

      {/* LEFT SIDE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <ProductPreview title={product.title} />
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-1">{product.title}</h1>

        <RatingStars rating={product.rating} reviews={product.reviews} />

        <p className="text-gray-600 my-4 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <p>📄 Pages: <strong>{product.pages}</strong></p>

          <p>
            📘 Type:{" "}
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
              {product.type}
            </span>
          </p>

          <p className="flex items-center gap-2 text-green-600 font-medium">
            <ShieldCheck size={16} /> Instant & Secure Download
          </p>
        </div>

        {/* PRICE BOX */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-3xl font-bold text-blue-600">
            ₹{product.price}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 bg-gray-200 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition disabled:opacity-60 font-semibold"
          >
            <ShoppingCart size={18} />
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          <Link
            to="/checkout"
            className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition font-semibold"
          >
            <Download size={18} /> Buy Now
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
