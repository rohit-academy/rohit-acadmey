import axios from "axios";

const API = axios.create({
  baseURL: "https://rohit-acadmey.onrender.com/api", // 🔥 Render backend
});

/* 🔐 Attach USER or ADMIN token automatically */
API.interceptors.request.use((req) => {
  try {
    const userToken = localStorage.getItem("token");

    const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
    const adminToken = adminData?.token;

    const token = adminToken || userToken;

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Token attach error:", error);
  }

  return req;
});

export default API;
