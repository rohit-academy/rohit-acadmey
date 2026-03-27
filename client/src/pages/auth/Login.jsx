import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Phone, Chrome, ArrowLeft } from "lucide-react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const otpRef = useRef(null);
  const recaptchaRef = useRef(null); // 🔥 FIX

  const [step, setStep] = useState("choose");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpRequests, setOtpRequests] = useState(0);

  const redirectPath = location.state?.from || "/account";

  const getCleanPhone = () => {
    const digits = phone.replace(/\D/g, "");
    return digits.slice(-10);
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* 🔥 INIT RECAPTCHA (ONCE ONLY) */
  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return recaptchaRef.current;
  };

  /* 🔥 SEND OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanPhone = getCleanPhone();

    if (cleanPhone.length !== 10) {
      setError("Enter valid phone number");
      return;
    }

    if (otpRequests >= 5) {
      setError("Too many attempts. Try later.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const appVerifier = setupRecaptcha();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + cleanPhone,
        appVerifier
      );

      window.confirmationResult = confirmationResult;

      setOtpSent(true);
      setTimer(60);
      setOtpRequests((p) => p + 1);

      setTimeout(() => otpRef.current?.focus(), 200);

    } catch (err) {
      setError(err.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 VERIFY OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      if (!window.confirmationResult) {
        throw new Error("OTP session expired");
      }

      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/firebase-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: firebaseUser.phoneNumber
          })
        }
      );

      const data = await res.json();

      if (!data?.token || !data?.user) {
        throw new Error("Login failed");
      }

      /* 🔥 BEST PRACTICE */
      login(data); // full object

      navigate(redirectPath, { replace: true });

    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 RESEND */
  const handleResend = async () => {
    if (timer > 0 || loading) return;
    setTimer(60);
    await handleSendOtp({ preventDefault: () => {} });
  };

  /* 🔵 GOOGLE LOGIN */
  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200 px-4">

      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

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

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {step === "choose" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">
              Login to Rohit Academy
            </h1>

            <button
              onClick={() => setStep("phone")}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl mb-4"
            >
              <Phone size={18} />
              Continue with Phone
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl"
            >
              <Chrome size={18} />
              Continue with Google
            </button>
          </div>
        )}

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
                  className="w-full border p-4 rounded-xl text-center text-xl"
                />

                <div id="recaptcha-container"></div>

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