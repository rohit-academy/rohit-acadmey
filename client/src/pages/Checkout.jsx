import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";

function Checkout() {

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { cartItems = [], clearCart, total = 0 } = useCart();

  const [processing, setProcessing] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const formatPrice = (price = 0) =>
    `₹${Number(price).toLocaleString("en-IN")}`;

  /* =====================================
     🔄 LOAD RAZORPAY
  ===================================== */
  useEffect(() => {

    if (window.Razorpay) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setSdkLoaded(false);

    document.body.appendChild(script);

  }, []);

  /* =====================================
     🔐 REDIRECT SAFE (AFTER LOAD)
  ===================================== */
  useEffect(() => {

    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      navigate("/cart");
    }

  }, [user, cartItems, loading, navigate]);

  /* =====================================
     💳 PAYMENT
  ===================================== */
  const handlePayment = async () => {

    if (!sdkLoaded) {
      alert("Payment system loading...");
      return;
    }

    if (processing) return;

    try {

      setProcessing(true);

      const orderRes = await API.post("/orders/create-order", {
        materials: cartItems.map((i) => i._id),
      });

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Rohit Academy",
        description: "Study Materials Purchase",
        order_id: order.orderId,

        handler: async (response) => {
          try {

            await API.post("/orders/verify-payment", {
              ...response,
              materials: cartItems.map((i) => i._id),
            });

            clearCart();
            navigate("/success");

          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => setProcessing(false)
        },

        prefill: {
          contact: user?.phone || "",
        },

        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (res) => {
        console.error(res);
        alert("Payment failed");
        setProcessing(false);
      });

      rzp.open();

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
      setProcessing(false);

    }
  };

  /* =====================================
     ⏳ GLOBAL LOADING
  ===================================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  /* =====================================
     🛒 EMPTY STATE (SAFE UI)
  ===================================== */
  if (!cartItems.length) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-semibold mb-3">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/classes")}
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          Browse Materials
        </button>
      </div>
    );
  }

  /* =====================================
     ✅ MAIN UI
  ===================================== */
  return (

    <div className="min-h-screen bg-slate-50 py-8 px-4">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* LEFT */}
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
                    "https://via.placeholder.com/80x100"
                  }
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">
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

        {/* RIGHT */}
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
            className={`w-full py-3 rounded-lg text-white font-semibold ${
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