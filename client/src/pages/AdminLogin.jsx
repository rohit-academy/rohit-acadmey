import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔐 TEMP ADMIN AUTH (replace with backend later)
    setTimeout(() => {
      if (form.username === "admin" && form.password === "1234") {
        localStorage.setItem("admin", "true");
        navigate("/admin");
      } else {
        setError("Invalid Admin Credentials");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">

        <div className="flex flex-col items-center mb-6">
          <ShieldCheck size={40} className="text-blue-600 mb-2" />
          <h1 className="text-3xl font-bold">Admin Panel Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Authorized access only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            name="username"
            placeholder="Admin Username"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Checking..." : "Login as Admin"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
