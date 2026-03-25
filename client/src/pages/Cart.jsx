import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    cartItems,
    removeFromCart,
    clearCart,
    total
  } = useCart();

  const formatPrice = (price) =>
    `₹${(price || 0).toLocaleString("en-IN")}`;

  /* 🔥 SAFE ITEMS */
  const validItems = cartItems.filter(item => item && (item._id || item.id));

  /* ================= EMPTY ================= */
  if (validItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">

        <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full border">

          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-blue-50 rounded-full">
            <ShoppingCart size={40} className="text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold mb-2">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 text-sm mb-6">
            Add study materials to start preparing.
          </p>

          <Link
            to="/classes"
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
          >
            Browse Study Materials
          </Link>

        </div>

      </div>
    );
  }

  /* 🔐 CHECKOUT HANDLER */
  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  /* ❌ REMOVE WITH CONFIRM */
  const handleRemove = (id) => {
    const confirmDelete = window.confirm("Remove this item?");
    if (confirmDelete) {
      removeFromCart(id);
    }
  };

  /* ================= FILLED ================= */
  return (

    <div className="min-h-screen bg-slate-50 px-4 md:px-6 py-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Your Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* 🛒 ITEMS */}
        <div className="lg:col-span-2 space-y-4">

          {validItems.map((item) => {

            const id = item._id || item.id;

            return (
              <div
                key={id}
                className="bg-white p-4 md:p-5 rounded-xl shadow-sm flex gap-4 items-start hover:shadow-md transition"
              >

                {/* IMAGE */}
                <img
                  src={
                    item.thumbnail ||
                    item.previewImages?.[0] ||
                    "https://via.placeholder.com/100x120?text=PDF"
                  }
                  alt={item.title}
                  className="w-20 h-24 object-cover rounded-lg border"
                />

                {/* INFO */}
                <div className="flex-1">

                  <h2 className="font-semibold text-lg line-clamp-2">
                    {item.title || "Untitled"}
                  </h2>

                  <div className="text-sm text-gray-500 mt-1 space-y-1">
                    {item.type && <p>📘 {item.type}</p>}
                    {item.pages && <p>📄 {item.pages} pages</p>}
                  </div>

                  <p className="text-blue-600 font-bold mt-2">
                    {formatPrice(item.price)}
                  </p>

                </div>

                {/* REMOVE */}
                <button
                  onClick={() => handleRemove(id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>

              </div>
            );
          })}

        </div>

        {/* 📦 SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">

          <h2 className="text-xl font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Items</span>
            <span>{validItems.length}</span>
          </div>

          <div className="flex justify-between mb-4 font-semibold text-lg">
            <span>Total</span>
            <span className="text-blue-600">
              {formatPrice(total)}
            </span>
          </div>

          {/* 🔥 CTA */}
          <button
            onClick={handleCheckout}
            className="w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow font-semibold mb-3"
          >
            Proceed to Checkout
          </button>

          {/* 🧹 CLEAR CART */}
          <button
            onClick={clearCart}
            className="w-full text-sm text-red-500 hover:underline"
          >
            Clear Cart
          </button>

        </div>

      </div>

    </div>

  );

}

export default Cart;