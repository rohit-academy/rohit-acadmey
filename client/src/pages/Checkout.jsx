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

  /* ================= DEBUG ================= */
  console.log("🧪 Checkout Render");
  console.log("👤 user:", user);
  console.log("🛒 cartItems:", cartItems);
  console.log("💰 total:", total);
  console.log("🔑 Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY);

  const formatPrice = (price = 0) => {
    try {
      return `₹${Number(price).toLocaleString("en-IN")}`;
    } catch {
      return "₹0";
    }
  };

  /* ================= LOAD SDK ================= */
  useEffect(() => {

    if (window.Razorpay) {
      console.log("✅ Razorpay already loaded");
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      console.log("✅ Razorpay Loaded");
      setSdkLoaded(true);
    };

    script.onerror = () => {
      console.error("❌ Razorpay load failed");
    };

    document.body.appendChild(script);

  }, []);

  /* ================= REDIRECT SAFE ================= */
  useEffect(() => {

    if (loading) return;

    if (!user) {
      console.log("🚫 No user → login");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      console.log("🛒 Empty cart → cart");
      navigate("/cart");
    }

  }, [user, cartItems, loading, navigate]);

  /* ================= PAYMENT ================= */
  const handlePayment = async () => {

    console.log("💳 Payment Start");

    if (!sdkLoaded) {
      alert("Razorpay loading...");
      return;
    }

    if (!import.meta.env.VITE_RAZORPAY_KEY) {
      alert("Razorpay key missing ❌");
      console.error("❌ Missing Razorpay Key");
      return;
    }

    try {

      setProcessing(true);

      console.log("📡 Calling create-order API...");

      const orderRes = await API.post("/orders/create-order", {
        materials: cartItems.map((i) => i._id),
      });

      console.log("✅ Order API Response:", orderRes.data);

      const order = orderRes.data;

      const options = {
        key: "rzp_test_SXVITXdAfFireN", // 🔥 direct use (for testing)
        amount: order.amount,
        currency: order.currency,
        name: "Rohit Academy",
        description: "Study Materials",
        order_id: order.orderId,

        handler: async (response) => {
          console.log("💰 Payment Success:", response);

          try {

            await API.post("/orders/verify-payment", {
              ...response,
              materials: cartItems.map((i) => i._id),
            });

            console.log("✅ Payment Verified");

            clearCart();
            navigate("/success");

          } catch (err) {
            console.error("❌ Verify error:", err);
            alert("Verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("❌ Modal closed");
            setProcessing(false);
          }
        },

        prefill: {
          contact: user?.phone || ""
        },

        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (res) => {
        console.error("❌ Payment Failed:", res);
        alert("Payment failed");
        setProcessing(false);
      });

      console.log("🚀 Opening Razorpay");

      rzp.open();

    } catch (err) {

      console.error("💥 PAYMENT ERROR:", err);

      alert(err.response?.data?.message || "Order API failed ❌");

      setProcessing(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  /* ================= EMPTY ================= */
  if (!cartItems.length) {
    return (
      <div className="text-center py-20">
        <h2>Cart Empty</h2>
        <button onClick={() => navigate("/classes")}>
          Go Back
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* DEBUG PANEL */}
      <div className="bg-yellow-100 p-3 mb-6 text-sm rounded">
        <p>User: {user?.phone || "NULL"}</p>
        <p>Items: {cartItems.length}</p>
        <p>Total: ₹{total}</p>
        <p>SDK: {sdkLoaded ? "Loaded" : "Loading..."}</p>
      </div>

      {/* ITEMS */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between border-b pb-2">
            <span>{item.title}</span>
            <span>{formatPrice(item.price)}</span>
          </div>
        ))}
      </div>

      {/* PAY BUTTON */}
      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>

      <div className="flex items-center gap-2 mt-4 text-green-600 text-sm justify-center">
        <ShieldCheck size={16} />
        Secure payment via Razorpay
      </div>

    </div>
  );
}

export default Checkout;