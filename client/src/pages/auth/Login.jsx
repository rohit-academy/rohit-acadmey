import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase";
import API from "../../services/api";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     🔥 GOOGLE LOGIN (FINAL DEBUG VERSION)
  ============================== */
  const handleGoogleLogin = async () => {
    try {

      setError("");

      const provider = new GoogleAuthProvider();

      console.log("🚀 Opening Google popup...");

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log("✅ Google User:", user);

      /* 🔥 GET TOKEN */
      const idToken = await user.getIdToken();

      console.log("🔥 Firebase Token:", idToken);

      /* 🔥 BACKEND LOGIN */
      console.log("📡 Calling backend...");

      const res = await API.post("/auth/firebase-login", {
        token: idToken
      });

      console.log("📦 Backend Response:", res.data);

      /* ❌ SAFETY CHECK */
      if (!res.data?.token) {
        throw new Error("Token not received from backend");
      }

      /* 🔐 SAVE */
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("✅ LOGIN SUCCESS");

      navigate(redirectPath, { replace: true });

    } catch (err) {

      console.error("❌ FULL ERROR:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Google login failed"
      );
    }
  };

  /* ===============================
     🔥 EMAIL LOGIN
  ============================== */
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {

      setLoading(true);
      setError("");

      console.log("📡 Email login...");

      const res = await API.post("/auth/login", {
        email,
        password
      });

      console.log("📦 Email Response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(redirectPath, { replace: true });

    } catch (err) {

      console.error("❌ Email Login Error:", err);

      setError(err.response?.data?.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200 px-4">

      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Rohit Academy
        </h1>

        {/* 🔥 ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* 🔥 GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl mb-4 font-medium transition"
        >
          Continue with Google
        </button>

        <div className="text-center text-gray-400 mb-4">
          OR
        </div>

        {/* 🔥 EMAIL LOGIN */}
        <form onSubmit={handleEmailLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );
}

export default Login;