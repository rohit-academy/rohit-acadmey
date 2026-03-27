import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================
     🔄 AUTO LOAD USER
  ===================================== */
  useEffect(() => {

    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        /* ⚡ FAST LOAD */
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        /* 🔥 VERIFY TOKEN */
        const res = await API.get("/auth/me");

        const userData = res.data?.user;

        if (!userData) throw new Error();

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    /* 🔥 MULTI TAB LOGOUT SYNC */
    const syncLogout = (e) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);

  }, []);

  /* =====================================
     🔐 LOGIN (FINAL FIX 🔥)
  ===================================== */
  const login = async (data) => {
    try {

      /* 🔥 CASE 1: {token, user} */
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return;
      }

      /* 🔥 CASE 2: ONLY TOKEN */
      if (typeof data === "string") {
        localStorage.setItem("token", data);

        const res = await API.get("/auth/me");
        const userData = res.data?.user;

        if (!userData) throw new Error();

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return;
      }

      /* 🔥 CASE 3: ONLY USER (fallback) */
      if (typeof data === "object") {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return;
      }

    } catch {
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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================
   🔹 SAFE HOOK
===================================== */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};