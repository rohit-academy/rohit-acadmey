import axios from "axios";

// 🔥 Base URL (backend server)
const API = axios.create({
  baseURL: "http://localhost:5000/api", // later env variable me dalenge
});

// 🔐 Attach token automatically (login ke baad)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
