import axios from "axios";

/* =====================================
   🌐 BASE URL (ENV SUPPORT)
===================================== */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://rohit-acadmey.onrender.com/api",
  withCredentials: true // 🔥 important for auth (future cookies / google)
});

/* =====================================
   🔐 REQUEST INTERCEPTOR (TOKEN ATTACH)
===================================== */
API.interceptors.request.use(
  (req) => {
    try {
      const userToken = localStorage.getItem("token");

      const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
      const adminToken = adminData?.token;

      const token = adminToken || userToken;

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
   🚨 RESPONSE INTERCEPTOR (AUTO ERROR HANDLE)
===================================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {

    const status = error.response?.status;

    /* 🔐 AUTO LOGOUT IF TOKEN EXPIRED */
    if (status === 401) {
      console.warn("⚠️ Unauthorized - logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("admin");

      window.location.href = "/login";
    }

    /* 🚫 BLOCKED USER */
    if (status === 403) {
      console.warn("🚫 Access forbidden");
    }

    return Promise.reject(error);
  }
);

export default API;