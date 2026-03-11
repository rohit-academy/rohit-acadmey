import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShieldCheck } from "lucide-react";
import Loader from "../components/ui/Loader";
import ProductPreview from "../components/product/ProductPreview";
import RatingStars from "../components/product/RatingStars";
import { useCart } from "../context/CartContext";
import API from "../services/api";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  /* FETCH PRODUCT */
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await API.get(`/materials/${id}`);

        const data =
          res.data?.data ||
          res.data ||
          null;

        setProduct(data);

      } catch (error) {

        console.error("Product fetch error:", error);
        setProduct(null);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  if (loading) return <Loader />;

  if (!product) {

    return (
      <div className="text-center py-20">

        <h2 className="text-2xl font-bold mb-4">
          Product not found
        </h2>

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

      {/* LEFT SIDE - PREVIEW ONLY */}
      <div className="bg-white p-6 rounded-xl shadow">

        <ProductPreview
          fileUrl={product.fileUrl}
          title={product.title}
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-1">
          {product.title}
        </h1>

        <RatingStars
          rating={product.rating || 4.5}
          reviews={product.reviews || 0}
        />

        <p className="text-gray-600 my-4 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-6">

          <p>
            📄 Pages: <strong>{product.pages}</strong>
          </p>

          <p>
            📘 Type:{" "}
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
              {product.type}
            </span>
          </p>

          <p className="flex items-center gap-2 text-green-600 font-medium">
            <ShieldCheck size={16} /> Instant & Secure Download after purchase
          </p>

        </div>

        {/* PRICE */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">

          <p className="text-sm text-gray-500">
            Price
          </p>

          <p className="text-3xl font-bold text-blue-600">
            ₹{product.price}
          </p>

        </div>

        {/* ONLY ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 font-semibold"
        >
          <ShoppingCart size={18} />
          {adding ? "Adding..." : "Add to Cart"}
        </button>

      </div>

    </div>

  );

}

export default ProductDetails;