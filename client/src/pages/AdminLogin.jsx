import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle, Eye, EyeOff } from "lucide-react";
import API from "../services/api";

function AdminLogin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* LOGIN */

  const handleLogin = async (e) => {

    e.preventDefault();

    if (loading || success) return;

    setLoading(true);
    setError("");

    try {

      const res = await API.post("/admin/login", {
        username: form.username,
        password: form.password
      });

      localStorage.setItem("admin", JSON.stringify(res.data));

      setSuccess(true);

      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1200);

    } catch (err) {

      setError(
        err.response?.data?.message || "🔐 Wrong credentials"
      );

      setShake(true);

      setTimeout(() => setShake(false), 450);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
    bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      {/* 🔥 FLOATING BLOBS */}

      <div className="absolute w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 top-[-50px] left-[-50px] animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 bottom-[-50px] right-[-50px] animate-pulse"></div>

      {/* CARD */}

      <div
        className={`relative z-10 max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl transition-all duration-300
        ${shake ? "animate-[shake_.45s]" : ""}
        ${success ? "animate-[success_.4s] border-2 border-green-500" : ""}`}
      >

        {/* HEADER */}

        <div className="flex flex-col items-center mb-6">

          {success ? (
            <CheckCircle size={42} className="text-green-600 mb-2" />
          ) : (
            <ShieldCheck size={42} className="text-blue-600 mb-2" />
          )}

          <h1 className="text-3xl font-bold">
            Admin Panel Login
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Authorized access only
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* USERNAME */}

          <input
            name="username"
            placeholder="Admin Username"
            required
            disabled={success}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.01] transition outline-none disabled:bg-gray-100"
          />

          {/* PASSWORD */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              disabled={success}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.01] transition outline-none disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <span className="transition-transform duration-200 hover:scale-110">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </button>

          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading || success}
            className="relative w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition overflow-hidden"
            onClick={(e) => {

              const circle = document.createElement("span");

              const diameter = Math.max(
                e.currentTarget.clientWidth,
                e.currentTarget.clientHeight
              );

              const radius = diameter / 2;

              circle.style.width = circle.style.height = `${diameter}px`;
              circle.style.left = `${e.clientX - e.currentTarget.offsetLeft - radius}px`;
              circle.style.top = `${e.clientY - e.currentTarget.offsetTop - radius}px`;
              circle.classList.add("ripple");

              const ripple = e.currentTarget.getElementsByClassName("ripple")[0];

              if (ripple) ripple.remove();

              e.currentTarget.appendChild(circle);

            }}
          >

            {/* PROGRESS */}

            {loading && (
              <span className="absolute bottom-0 left-0 h-1 bg-white/70 animate-[progress_1.5s_linear_infinite] w-full"></span>
            )}

            {success ? (
              <>
                <CheckCircle size={18} />
                Login Successful
              </>
            ) : loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                🚀 Logging you in...
              </>
            ) : (
              "Login as Admin"
            )}

          </button>

        </form>

      </div>

      {/* ANIMATIONS */}

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-7px); }
          80% { transform: translateX(7px); }
          100% { transform: translateX(0); }
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes success {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(255, 255, 255, 0.6);
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

    </div>

  );

}

export default AdminLogin;