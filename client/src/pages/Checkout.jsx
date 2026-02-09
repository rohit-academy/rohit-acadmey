import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, total } = useCart();

  const [processing, setProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) return alert("Please login first");
    if (cartItems.length === 0) return alert("Cart is empty");

    setProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load");
      setProcessing(false);
      return;
    }

    try {
      // 🔹 1. Create order from backend
      const { data } = await axios.post("/api/orders/create-order", {
        amount: total
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "Rohit Academy",
        description: "Study Materials Purchase",
        order_id: data.orderId,

        handler: async function (response) {
          try {
            // 🔹 2. Verify payment
            await axios.post("/api/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id,
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

        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Logged in as</p>
          <p className="font-semibold text-blue-700">{user?.phone}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">Items:</p>
          {cartItems.map((item) => (
            <div key={item.id} className="text-sm flex justify-between">
              <span>{item.title}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>

        <div className="text-right font-bold text-lg">
          Total: ₹{total}
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className={`w-full py-3 rounded-lg text-lg transition text-white ${
            processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {processing ? "Processing..." : "Pay Securely"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
