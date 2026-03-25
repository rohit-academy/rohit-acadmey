import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Phone, Chrome, ArrowLeft } from "lucide-react";

import {
  sendOtp,
  verifyOtp
} from "../../services/authService";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const otpRef = useRef(null);

  const [step, setStep] = useState("choose");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  /* 🔙 REDIRECT FIX */
  const redirectPath = location.state?.from || "/account";

  /* 📱 CLEAN PHONE */
  const getCleanPhone = () => {
    const digits = phone.replace(/\D/g, "");
    return digits.slice(-10); // ✅ always last 10 digits
  };

  /* ⏱ TIMER */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* 📲 SEND OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanPhone = getCleanPhone();

    if (cleanPhone.length !== 10) {
      setError("Enter valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendOtp(cleanPhone);

      setOtpSent(true);
      setTimer(60);

      setTimeout(() => otpRef.current?.focus(), 200);

    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ VERIFY OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!/^[0-9]{4,6}$/.test(otp)) {
      setError("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const cleanPhone = getCleanPhone();

      const res = await verifyOtp(cleanPhone, otp);

      if (!res?.token) throw new Error("Login failed");

      localStorage.setItem("token", res.token);
      login(res.user);

      /* 🔥 REDIRECT FIX */
      navigate(redirectPath, { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 RESEND */
  const handleResend = async () => {
    if (timer > 0 || loading) return;

    try {
      setTimer(60);
      await sendOtp(getCleanPhone());
    } catch {
      setError("Failed to resend OTP");
    }
  };

  /* 🔵 GOOGLE LOGIN */
  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      setError("API URL not configured");
      return;
    }

    window.location.href = `${API_URL}/auth/google`;
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200 px-4">

      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

        {/* BACK */}
        {step !== "choose" && (
          <button
            onClick={() => {
              setStep("choose");
              setOtpSent(false);
              setError("");
              setOtp("");
              setPhone("");
            }}
            className="mb-4 text-gray-500 flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === "choose" && (
          <div className="text-center">

            <h1 className="text-2xl font-bold mb-6">
              Login to Rohit Academy
            </h1>

            <button
              onClick={() => setStep("phone")}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl mb-4 hover:bg-blue-700 transition"
            >
              <Phone size={18} />
              Continue with Phone
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

          </div>
        )}

        {/* STEP 2 */}
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
                    borderRadius: "12px"
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

              </form>

            ) : (

              <form onSubmit={handleVerifyOtp} className="space-y-5">

                <p className="text-center text-gray-600">
                  OTP sent to <strong>{getCleanPhone()}</strong>
                </p>

                <input
                  ref={otpRef}
                  type="tel"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter OTP"
                  className="w-full border p-4 rounded-xl text-center text-xl tracking-widest"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl"
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
                    disabled={timer > 0}
                    onClick={handleResend}
                    className={timer > 0 ? "text-gray-400" : "text-blue-600"}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
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