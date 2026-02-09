import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 📩 Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      alert("OTP sent to " + phone);
      setOtpSent(true);
      setLoading(false);
    }, 800); // fake delay
  };

  // ✅ Verify OTP
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
        phone: phone
      });

      alert("Login Successful ✅");
      navigate("/");
    }, 800);
  };

  // 🔁 Resend OTP
  const handleResend = () => {
    alert("OTP resent to " + phone);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold text-center mb-6">
        Login with OTP
      </h1>

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 10 digit number"
              required
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-center text-gray-600">
            OTP sent to <strong>{phone}</strong>
          </p>

          <div>
            <label className="block text-sm mb-1">Enter OTP</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="4 digit OTP"
              required
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-center text-lg tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>

          <div className="flex justify-between text-sm mt-2">
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
  );
}

export default Login;
