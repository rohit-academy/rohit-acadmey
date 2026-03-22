import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================
     🔄 AUTO LOAD USER FROM TOKEN
  ===================================== */
  useEffect(() => {

    const loadUser = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          return;
        }

        const res = await API.get("/auth/me");

        const userData = res.data?.data;

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

      } catch (error) {

        console.log("Auto login failed");

        /* ❌ CLEAN INVALID DATA */
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

      } finally {
        setLoading(false);
      }

    };

    loadUser();

  }, []);

  /* =====================================
     🔐 LOGIN (🔥 FINAL FIX)
     - token based
  ===================================== */
  const login = async (token) => {

    if (!token) return;

    try {

      /* 🔥 CLEAR OLD USER */
      localStorage.removeItem("user");

      /* 🔐 SAVE TOKEN */
      localStorage.setItem("token", token);

      /* 🔥 FETCH FRESH USER */
      const res = await API.get("/auth/me");

      const userData = res.data?.data;

      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

    } catch (error) {

      console.log("Login failed");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);

    }

  };

  /* =====================================
     🚪 LOGOUT (FULL CLEAN)
  ===================================== */
  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* =====================================
     ⏳ LOADING STATE
  ===================================== */
  if (loading) {
    return null; // ya loader laga sakta hai
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================
   🔹 HOOK
===================================== */
export const useAuth = () => useContext(AuthContext);