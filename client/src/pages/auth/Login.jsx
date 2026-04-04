import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Phone, ArrowLeft } from "lucide-react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../config/firebase";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState("choose");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpRequests, setOtpRequests] = useState(0);

  const redirectPath = location.state?.from || "/account";

  /* =====================================
     📱 CLEAN PHONE
  ===================================== */
  const getCleanPhone = () => {
    const digits = phone.replace(/\D/g, "");
    return digits.slice(-10);
  };

  /* =====================================
     🔥 INIT RECAPTCHA (GLOBAL SAFE)
  ===================================== */
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible"
        }
      );
    }
  }, []);

  /* =====================================
     🔥 SEND OTP (FINAL)
  ===================================== */
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

      const appVerifier = window.recaptchaVerifier;

      const fullPhone = "+91" + cleanPhone;

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        appVerifier
      );

      /* 🔥 SAVE FOR VERIFY PAGE */
      window.confirmationResult = confirmation;

      setOtpRequests((prev) => prev + 1);

      navigate("/verify-otp", {
        state: {
          phone: fullPhone,
          from: redirectPath
        }
      });

    } catch (err) {

      console.error("OTP Error:", err);

      setError(
        err.message ||
        "Failed to send OTP. Try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     UI
  ===================================== */
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200 px-4">

      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

        {/* BACK BUTTON */}
        {step !== "choose" && (
          <button
            onClick={() => {
              setStep("choose");
              setError("");
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
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl"
            >
              <Phone size={18} />
              Continue with Phone
            </button>

          </div>
        )}

        {/* STEP 2 */}
        {step === "phone" && (
          <div>

            <h2 className="text-xl font-semibold text-center mb-6">
              Phone Login
            </h2>

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

            {/* 🔥 MUST REQUIRED */}
            <div id="recaptcha-container"></div>

          </div>
        )}

      </div>

    </div>

  );
}

export default Login;