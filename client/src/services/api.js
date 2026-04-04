import axios from "axios";

/* =====================================
   🌐 BASE CONFIG (FIXED 🔥)
===================================== */
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://rohit-acadmey.onrender.com/api", // ✅ FIXED spelling
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================
   🔧 SAFE JSON PARSE
===================================== */
const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

/* =====================================
   🔐 REQUEST INTERCEPTOR (SMART 🔥)
===================================== */
API.interceptors.request.use(
  (config) => {
    try {
      const userToken = localStorage.getItem("token");

      const adminData = safeParse(localStorage.getItem("admin"));
      const adminToken = adminData?.token;

      /* 🔥 ADMIN ROUTE CHECK */
      const isAdminRoute =
        config.url?.startsWith("/admin") ||
        window.location.pathname.startsWith("/admin");

      const token = isAdminRoute ? adminToken : userToken;

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
   🚨 RESPONSE INTERCEPTOR (FINAL 🔥)
===================================== */
let isRedirecting = false;

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    /* 🔐 401 → AUTO LOGOUT */
    if (status === 401 && !isRedirecting) {
      isRedirecting = true;

      console.warn("⚠️ Session expired");

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