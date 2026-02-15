import axios from "axios";

const API = axios.create({
  baseURL: "/api", // 🔥 proxy or same domain
});

/* 🔐 Attach USER or ADMIN token automatically */
API.interceptors.request.use((req) => {
  try {
    /* 🧑 USER TOKEN */
    const userToken = localStorage.getItem("token");

    /* 🛡 ADMIN TOKEN */
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
