import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle } from "lucide-react";
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
        err.response?.data?.message || "Admin login failed"
      );

      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 450);

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">

      <div
        className={`max-w-md w-full bg-white p-8 rounded-xl shadow-lg transition-all duration-300
        ${shake ? "animate-[shake_.45s]" : ""}
        ${success ? "border-2 border-green-500" : ""}`}
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

          <input
            name="username"
            placeholder="Admin Username"
            required
            disabled={success}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            disabled={success}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading || success}
            className="relative w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 overflow-hidden"
          >

            {/* PROGRESS BAR */}

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
                Checking... Please wait
              </>
            ) : (
              "Login as Admin"
            )}

          </button>

        </form>

      </div>

      {/* CUSTOM ANIMATIONS */}

      <style>
        {`
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
        `}
      </style>

    </div>

  );

}

export default AdminLogin;