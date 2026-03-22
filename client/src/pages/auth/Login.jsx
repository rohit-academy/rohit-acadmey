import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Phone, Chrome, ArrowLeft } from "lucide-react";

import {
  sendOtp,
  verifyOtp,
  loginWithPhone
} from "../../services/authService";

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("choose");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 📱 SEND OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (phone.length < 10) {
      setError("Enter valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendOtp(phone); // ✅ FIXED (no +)

      setOtpSent(true);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ VERIFY OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{4,6}$/.test(otp)) {
      setError("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await verifyOtp(phone, otp); // ✅ FIXED

      /* 🔐 LOGIN AFTER VERIFY */
      const res = await loginWithPhone(phone); // ✅ FIXED

      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      /* 🔥 MOST IMPORTANT FIX */
      login(res.data.user); // ✅ REAL USER STORE

      navigate("/account");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 RESEND */
  const handleResend = async () => {
    try {
      await sendOtp(phone);
      setError("");
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200 px-4">

      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

        {/* 🔙 BACK */}
        {step !== "choose" && (
          <button
            onClick={() => {
              setStep("choose");
              setOtpSent(false);
              setError("");
            }}
            className="mb-4 text-gray-500 flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {/* ❌ ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* =========================
            STEP 1: CHOOSE LOGIN
        ========================= */}
        {step === "choose" && (

          <div className="text-center">

            <h1 className="text-2xl font-bold mb-6">
              Login to Rohit Academy
            </h1>

            {/* 📱 PHONE */}
            <button
              onClick={() => setStep("phone")}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl mb-4 hover:bg-blue-700 transition"
            >
              <Phone size={18} />
              Continue with Phone
            </button>

            {/* 🔵 GOOGLE */}
            <button
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

          </div>
        )}

        {/* =========================
            STEP 2: PHONE LOGIN
        ========================= */}
        {step === "phone" && (

          <div>

            <h2 className="text-xl font-semibold text-center mb-6">
              Phone Login
            </h2>

            {!otpSent ? (

              <form onSubmit={handleSendOtp} className="space-y-5">

                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

              </form>

            ) : (

              <form onSubmit={handleVerifyOtp} className="space-y-5">

                <p className="text-center text-gray-600">
                  OTP sent to <strong>{phone}</strong>
                </p>

                <input
                  type="tel"
                  placeholder="Enter OTP"
                  value={otp}
                  required
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full border p-4 rounded-xl text-center text-xl tracking-widest focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <div className="flex justify-between text-sm">

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-gray-500"
                  >
                    Change Number
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600"
                  >
                    Resend OTP
                  </button>

                </div>

              </form>

            )}

          </div>
        )}

      </div>

    </div>

  );

}

export default Login;