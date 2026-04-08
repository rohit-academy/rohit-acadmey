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
   🔐 REQUEST INTERCEPTOR
   (ADMIN + USER TOKEN SUPPORT)
===================================== */
API.interceptors.request.use(
  (config) => {
    try {

      /* 🔥 ADMIN TOKEN FIRST */
      const admin = JSON.parse(localStorage.getItem("admin") || "null");

      const token =
        admin?.token ||
        localStorage.getItem("token");

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
   🚨 RESPONSE INTERCEPTOR
===================================== */
let isRedirecting = false;

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    /* =====================================
       🔐 401 SESSION EXPIRED
    ===================================== */
    if (status === 401 && !isRedirecting) {

      isRedirecting = true;

      console.warn("⚠️ Session expired");

      /* 🔥 CLEAR STORAGE */
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");

      /* 🔥 SMART REDIRECT */
      if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin-login";
      } else {
        window.location.href = "/login";
      }

      setTimeout(() => {
        isRedirecting = false;
      }, 1500);
    }

    /* =====================================
       🚫 403 ACCESS DENIED
    ===================================== */
    if (status === 403) {
      console.warn("🚫 Access forbidden");
    }

    /* =====================================
       🌐 NETWORK ERROR
    ===================================== */
    if (!error.response) {
      console.error("🌐 Network error / timeout");
    }

    return Promise.reject(error);
  }
);

export default API;