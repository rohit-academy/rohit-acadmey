import axios from "axios";

/* =====================================
   🌐 BASE CONFIG
===================================== */
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://rohit-acadmey.onrender.com/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================
   🔐 REQUEST INTERCEPTOR (SIMPLE 🔥)
===================================== */
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ Token attach error:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================
   🚨 RESPONSE INTERCEPTOR (CLEAN 🔥)
===================================== */
let isRedirecting = false;

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    /* 🔐 401 → AUTO LOGOUT */
    if (status === 401 && !isRedirecting) {
      isRedirecting = true;

      console.warn("⚠️ Session expired");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      /* 🔥 SIMPLE REDIRECT */
      window.location.href = "/login";

      setTimeout(() => {
        isRedirecting = false;
      }, 1500);
    }

    /* 🚫 403 */
    if (status === 403) {
      console.warn("🚫 Access forbidden");
    }

    /* 🌐 NETWORK ERROR */
    if (!error.response) {
      console.error("🌐 Network error / timeout");
    }

    return Promise.reject(error);
  }
);

export default API;