import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (phone.length < 12) {
      alert("Enter valid phone number");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!/^[0-9]{4}$/.test(otp)) {
      alert("Enter valid 4 digit OTP");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      login({
        name: "Student",
        phone: "+" + phone
      });

      navigate("/");
    }, 800);
  };

  const handleResend = () => {
    alert("OTP resent to +" + phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200">

      <div className="grid w-full max-w-5xl lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT PANEL (Desktop only) */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">

          <h1 className="text-5xl font-bold mb-6">
            Rohit Academy
          </h1>

          <p className="text-lg opacity-90 mb-8">
            Notes, Sample Papers & Previous Year Questions
            for Classes 9–12.
          </p>

          <div className="space-y-4 text-sm">

            <div>📚 High quality study materials</div>

            <div>⚡ Instant PDF access after purchase</div>

            <div>🔒 Secure payments with Razorpay</div>

            <div>📱 Mobile friendly learning</div>

          </div>

        </div>

        {/* LOGIN PANEL */}
        <div className="flex items-center justify-center p-8 sm:p-12">

          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-center mb-8">
              Login with OTP
            </h2>

            {!otpSent ? (

              <form onSubmit={handleSendOtp} className="space-y-6">

                <label className="block text-sm font-medium">
                  Phone Number
                </label>

                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{
                    width: "100%",
                    height: "54px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition shadow-md"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

              </form>

            ) : (

              <form onSubmit={handleVerifyOtp} className="space-y-6">

                <p className="text-center text-gray-600">
                  OTP sent to <strong>+{phone}</strong>
                </p>

                <input
                  type="tel"
                  placeholder="Enter 4 digit OTP"
                  value={otp}
                  required
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="w-full border p-4 rounded-xl text-center text-xl tracking-widest focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition shadow-md"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <div className="flex justify-between text-sm">

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    Change Number
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;