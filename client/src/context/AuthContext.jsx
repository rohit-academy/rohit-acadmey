import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================
     🔄 LOAD USER
  ===================================== */
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("🔐 TOKEN:", token);

      if (!token) {
        setUser(null);
        return;
      }

      /* ⚡ FAST CACHE LOAD */
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        console.log("⚡ Using cached user");
        setUser(JSON.parse(cachedUser));
      }

      /* 🔥 VERIFY FROM SERVER */
      console.log("📡 Calling /auth/me...");

      const res = await API.get("/auth/me");

      console.log("✅ /auth/me RESPONSE:", res.data);

      const userData = res.data?.user;

      if (!userData) {
        throw new Error("No user data");
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

    } catch (err) {
      console.error("❌ AUTH LOAD ERROR:", err.response?.data || err.message);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     🚀 AUTO LOAD
  ===================================== */
  useEffect(() => {

    loadUser();

    /* 🔥 MULTI TAB SYNC */
    const syncLogout = (e) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);

  }, []);

  /* =====================================
     🔐 LOGIN
  ===================================== */
  const login = async (data) => {
    try {

      console.log("🔐 LOGIN DATA:", data);

      /* ✅ CASE 1: token + user */
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        return;
      }

      /* ✅ CASE 2: only token */
      if (typeof data === "string") {
        localStorage.setItem("token", data);

        await loadUser(); // 🔥 IMPORTANT FIX
        return;
      }

      /* ✅ CASE 3: only user */
      if (typeof data === "object") {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return;
      }

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  /* =====================================
     🚪 LOGOUT
  ===================================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================
   🔹 HOOK
===================================== */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};