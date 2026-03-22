import axios from "axios";

/* =====================================
   🌐 BASE URL
===================================== */
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://rohit-acadmey.onrender.com/api",
  withCredentials: true,
});

/* =====================================
   🔐 REQUEST INTERCEPTOR
   - attach USER / ADMIN token
===================================== */
API.interceptors.request.use(
  (req) => {
    try {
      const userToken = localStorage.getItem("token");

      const adminData = JSON.parse(
        localStorage.getItem("admin") || "{}"
      );
      const adminToken = adminData?.token;

      /* 🔥 PRIORITY: admin > user */
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
   🚨 RESPONSE INTERCEPTOR
   - auto logout
   - error handling
===================================== */
API.interceptors.response.use(
  (response) => response,

  (error) => {

    const status = error.response?.status;

    /* =====================================
       🔐 401 → TOKEN EXPIRED / INVALID
    ===================================== */
    if (status === 401) {

      console.warn("⚠️ Session expired");

      /* 🔥 CLEAN ALL AUTH DATA */
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");

      /* 🔁 REDIRECT LOGIN */
      window.location.href = "/login";
    }

    /* =====================================
       🚫 403 → BLOCKED / FORBIDDEN
    ===================================== */
    if (status === 403) {
      console.warn("🚫 Access forbidden");

      alert("Your account is blocked or access denied");
    }

    /* =====================================
       🌐 NETWORK ERROR
    ===================================== */
    if (!error.response) {
      console.error("🌐 Network error");
      alert("Server not reachable. Try again.");
    }

    return Promise.reject(error);
  }
);

export default API;