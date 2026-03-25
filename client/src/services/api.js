import axios from "axios";

/* =====================================
   🌐 BASE CONFIG
===================================== */
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://rohit-acadmey.onrender.com/api",
  timeout: 15000, // 🔥 prevent hanging
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
   🔐 REQUEST INTERCEPTOR
===================================== */
API.interceptors.request.use(
  (req) => {
    try {
      const userToken = localStorage.getItem("token");

      const adminData = safeParse(localStorage.getItem("admin"));
      const adminToken = adminData?.token;

      /* 🔥 BETTER LOGIC */
      const isAdminRoute = req.url?.startsWith("/admin");

      let token = null;

      if (isAdminRoute) {
        token = adminToken;
      } else {
        token = userToken;
      }

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
let isRedirecting = false;

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

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      /* 🔥 RESET FLAG AFTER DELAY */
      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    /* 🚫 403 */
    if (status === 403) {
      console.warn("🚫 Access forbidden");
    }

    /* 🌐 NETWORK / TIMEOUT */
    if (!error.response) {
      console.error("🌐 Network error or timeout");
    }

    return Promise.reject(error);
  }
);

export default API;