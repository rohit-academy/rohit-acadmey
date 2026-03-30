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

  /* =====================================
     🧪 GLOBAL DEBUG
  ===================================== */
  console.log("🧪 Checkout Render");
  console.log("👤 user:", user);
  console.log("🛒 cartItems:", cartItems);
  console.log("💰 total:", total);
  console.log("⏳ loading:", loading);

  const formatPrice = (price = 0) => {
    try {
      return `₹${Number(price).toLocaleString("en-IN")}`;
    } catch (err) {
      console.error("💥 Price format error:", err);
      return "₹0";
    }
  };

  /* =====================================
     🔄 LOAD RAZORPAY
  ===================================== */
  useEffect(() => {

    console.log("🚀 Loading Razorpay SDK");

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
      console.error("❌ Razorpay failed to load");
      setSdkLoaded(false);
    };

    document.body.appendChild(script);

  }, []);

  /* =====================================
     🔐 REDIRECT DEBUG
  ===================================== */
  useEffect(() => {

    console.log("🔐 Redirect check");

    if (loading) {
      console.log("⏳ Still loading...");
      return;
    }

    if (!user) {
      console.log("🚫 No user → redirect login");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      console.log("🛒 Empty cart → redirect cart");
      navigate("/cart");
    }

  }, [user, cartItems, loading, navigate]);

  /* =====================================
     💳 PAYMENT DEBUG
  ===================================== */
  const handlePayment = async () => {

    console.log("💳 Payment clicked");

    if (!sdkLoaded) {
      console.warn("⚠️ Razorpay not loaded");
      alert("Payment system loading...");
      return;
    }

    if (processing) {
      console.log("⛔ Already processing");
      return;
    }

    try {

      setProcessing(true);

      console.log("📡 Creating order...");

      const orderRes = await API.post("/orders/create-order", {
        materials: cartItems.map((i) => i._id),
      });

      console.log("✅ Order response:", orderRes.data);

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Rohit Academy",
        order_id: order.orderId,

        handler: async (response) => {

          console.log("💰 Payment success:", response);

          try {

            await API.post("/orders/verify-payment", {
              ...response,
              materials: cartItems.map((i) => i._id),
            });

            console.log("✅ Payment verified");

            clearCart();
            navigate("/success");

          } catch (err) {
            console.error("❌ Verification error:", err);
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("❌ Payment modal closed");
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (res) => {
        console.error("❌ Payment failed:", res);
        alert("Payment failed");
        setProcessing(false);
      });

      console.log("🚀 Opening Razorpay");

      rzp.open();

    } catch (err) {

      console.error("💥 Payment error:", err);

      alert(err.response?.data?.message || "Payment failed");
      setProcessing(false);

    }
  };

  /* =====================================
     ⏳ LOADING UI
  ===================================== */
  if (loading) {
    console.log("⏳ Rendering loader");
    return <div className="text-center py-20">Loading...</div>;
  }

  /* =====================================
     🛒 EMPTY UI
  ===================================== */
  if (!cartItems.length) {
    console.log("🛒 Rendering empty cart UI");

    return (
      <div className="text-center py-20">
        <h2>Cart Empty</h2>
        <button onClick={() => navigate("/classes")}>
          Go Back
        </button>
      </div>
    );
  }

  /* =====================================
     ✅ MAIN UI
  ===================================== */
  console.log("✅ Rendering main checkout UI");

  return (

    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Checkout Debug Mode
      </h1>

      {/* DEBUG PANEL */}
      <div className="bg-yellow-100 p-3 mb-4 text-xs">
        <p>User: {user?.phone || "NULL"}</p>
        <p>Items: {cartItems.length}</p>
        <p>Total: {total}</p>
        <p>SDK: {sdkLoaded ? "Loaded" : "Not Loaded"}</p>
      </div>

      {/* ITEMS */}
      {cartItems.map((item) => {
        console.log("📦 Item:", item);

        return (
          <div key={item._id}>
            <p>{item.title}</p>
            <p>{formatPrice(item.price)}</p>
          </div>
        );
      })}

      <button onClick={handlePayment}>
        Pay Now
      </button>

    </div>
  );
}

export default Checkout;