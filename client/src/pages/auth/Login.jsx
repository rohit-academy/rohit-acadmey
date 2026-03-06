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
      alert("OTP sent to +" + phone);
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

      alert("Login Successful ✅");
      navigate("/");
    }, 800);
  };

  const handleResend = () => {
    alert("OTP resent to +" + phone);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">

      {/* LEFT SIDE (Desktop branding) */}
      <div className="hidden lg:flex items-center justify-center bg-blue-600 text-white p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Rohit Academy
          </h1>

          <p className="text-lg opacity-90">
            Notes, Sample Papers & Previous Year Questions  
            for Classes 9–12.
          </p>

          <p className="mt-4 opacity-80">
            Login to access your purchased study materials instantly.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-3xl font-bold text-center mb-6">
            Login with OTP
          </h2>

          {!otpSent ? (

            <form onSubmit={handleSendOtp} className="space-y-5">

              <label className="block text-sm font-medium">
                Phone Number
              </label>

              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputStyle={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "10px"
                }}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg hover:bg-blue-700 transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

            </form>

          ) : (

            <form onSubmit={handleVerifyOtp} className="space-y-5">

              <p className="text-center text-gray-600">
                OTP sent to <strong>+{phone}</strong>
              </p>

              <label className="block text-sm font-medium">
                Enter OTP
              </label>

              <input
                type="tel"
                placeholder="4 digit OTP"
                value={otp}
                required
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="w-full border p-3 rounded-xl text-center text-lg tracking-widest focus:ring-2 focus:ring-green-500 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-lg hover:bg-green-700 transition"
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
  );
}

export default Login;