import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle, Download, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Success() {

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing...");

  const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true;

    let isMounted = true;

    const handleSuccess = async () => {

      try {
        const params = new URLSearchParams(location.search);

        const token = params.get("token");
        const payment = params.get("payment");

        /* 🔐 GOOGLE LOGIN */
        if (token) {

          setMessage("Logging you in...");

          // 🔥 context login (handles token + user)
          login(token);

          // 🔥 small delay to allow state update
          setTimeout(() => {

            if (!isMounted) return;

            const storedUser = localStorage.getItem("user");
            const user = storedUser ? JSON.parse(storedUser) : null;

            if (user) {
              if (!user.username) {
                navigate("/setup-username", { replace: true });
              } else {
                navigate("/account", { replace: true });
              }
            } else {
              navigate("/login", { replace: true });
            }

          }, 300);

          return;
        }

        /* 💳 PAYMENT SUCCESS */
        if (payment === "success") {

          setMessage("Unlocking your materials...");

          setTimeout(() => {
            if (isMounted) setLoading(false);
          }, 800);

          return;
        }

        /* ❌ INVALID */
        navigate("/login", { replace: true });

      } catch (error) {

        console.error("❌ Success Error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });

      }

    };

    handleSuccess();

    return () => {
      isMounted = false;
    };

  }, [location.search, navigate, login]);

  /* 🔄 LOADING */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    );
  }

  /* ✅ PAYMENT UI */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="max-w-xl w-full text-center bg-white p-8 sm:p-10 rounded-2xl shadow-lg">

        <CheckCircle className="mx-auto text-green-500 mb-4" size={70} />

        <h1 className="text-3xl font-bold mb-2 text-green-700">
          Success!
        </h1>

        <p className="text-gray-600 mb-6">
          Your materials are ready. You can download them anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/downloads")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download size={18} />
            Go to My Downloads
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            <Home size={18} />
            Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Success;