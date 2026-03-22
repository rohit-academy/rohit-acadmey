import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";

function Checkout() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, total } = useCart();

  const [processing, setProcessing] = useState(false);

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  /* 🔄 LOAD RAZORPAY */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* 💳 PAYMENT */
  const handlePayment = async () => {

    if (!user) {
      alert("Please login first");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {

      setProcessing(true);

      /* LOAD SDK */
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      /* 🔹 CREATE ORDER */
      const orderRes = await API.post("/orders", {
        materials: cartItems.map((i) => i._id),
        amount: total
      });

      const order = orderRes.data;

      /* 💳 RAZORPAY OPTIONS */
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Rohit Academy",
        description: "Study Materials Purchase",
        order_id: order.orderId,

        handler: async (response) => {

          try {

            /* 🔹 VERIFY PAYMENT */
            await API.post("/orders/verify-payment", {
              ...response,
              materials: cartItems.map((i) => i._id),
              amount: total
            });

            clearCart();
            navigate("/success");

          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }

        },

        prefill: {
          contact: user?.phone || "",
        },

        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.message || "Payment failed");

    } finally {
      setProcessing(false);
    }

  };

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-slate-50 py-8 px-4">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* LEFT - ITEMS */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Order Items
          </h2>

          <div className="space-y-4">

            {cartItems.map((item) => (

              <div key={item._id} className="flex gap-4">

                <img
                  src={
                    item.thumbnail ||
                    item.previewImages?.[0] ||
                    "https://via.placeholder.com/80x100?text=PDF"
                  }
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded"
                />

                <div className="flex-1">

                  <p className="font-medium line-clamp-2">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.type}
                  </p>

                </div>

                <p className="font-semibold text-blue-600">
                  {formatPrice(item.price)}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">

          <h2 className="text-xl font-semibold mb-4">
            Payment Summary
          </h2>

          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-center">
            <p className="text-sm text-gray-600">
              Logged in as
            </p>
            <p className="font-semibold text-blue-700">
              {user?.phone || "User"}
            </p>
          </div>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between mb-4 text-lg font-semibold">
            <span>Total</span>
            <span className="text-blue-600">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
            <ShieldCheck size={16} />
            Secure payment via Razorpay
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              processing
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {processing ? "Processing..." : "Pay Securely"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default Checkout;