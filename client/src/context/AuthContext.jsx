import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================
     🔄 LOAD USER (AUTO LOGIN)
  ===================================== */
  const loadUser = async () => {
    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      /* ⚡ INSTANT UI LOAD (CACHE) */
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }

      /* 🔥 VERIFY FROM SERVER */
      const res = await API.get("/auth/me");

      const userData = res.data?.user;

      if (!userData) throw new Error("Invalid user");

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

    } catch (err) {

      console.error("❌ AUTH ERROR:", err.response?.data || err.message);

      /* 🔥 AUTO LOGOUT */
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     🚀 INITIAL LOAD + SYNC
  ===================================== */
  useEffect(() => {

    /* ✅ INSTANT LOAD FROM LOCAL (FAST UX) */
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadUser();

    /* 🔥 MULTI TAB LOGOUT SYNC */
    const syncLogout = (e) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };

  }, []);

  /* =====================================
     🔐 LOGIN (SIMPLIFIED 🔥)
  ===================================== */
  const login = (data) => {

    if (!data?.token || !data?.user) {
      console.error("❌ Invalid login data");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  /* =====================================
     🚪 LOGOUT
  ===================================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    /* 🔥 OPTIONAL REDIRECT */
    window.location.href = "/";
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