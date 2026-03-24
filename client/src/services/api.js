import axios from "axios";

/* =====================================
   🌐 BASE URL (FIXED)
===================================== */
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://rohit-acadmey.onrender.com/api", // ✅ FIXED
});

/* =====================================
   🔐 REQUEST INTERCEPTOR
===================================== */
API.interceptors.request.use(
  (req) => {
    try {
      const userToken = localStorage.getItem("token");

      // 🔥 admin separate rakho (optional future)
      const adminData = JSON.parse(
        localStorage.getItem("admin") || "{}"
      );
      const adminToken = adminData?.token;

      // ✅ safer logic
      const isAdminRoute = req.url?.includes("/admin");
      const token = isAdminRoute ? adminToken : userToken;

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }

    } catch (error) {
      console.error("❌ Token attach error:", error);
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/* =====================================
   🚨 RESPONSE INTERCEPTOR
===================================== */
let isRedirecting = false; // 🔥 prevent multi redirect

API.interceptors.response.use(
  (response) => response,

  (error) => {

    const status = error.response?.status;

    /* 🔐 401 */
    if (status === 401 && !isRedirecting) {

      isRedirecting = true;

      console.warn("⚠️ Session expired");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");

      // 🔥 prevent loop
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    /* 🚫 403 */
    if (status === 403) {
      console.warn("🚫 Access forbidden");

      // 👉 better than alert
      console.error("Access denied");
    }

    /* 🌐 NETWORK */
    if (!error.response) {
      console.error("🌐 Network error");
    }

    return Promise.reject(error);
  }
);

export default API;