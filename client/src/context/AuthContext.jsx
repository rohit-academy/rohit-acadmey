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

        /* ⚡ FAST LOAD FROM CACHE */
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        /* 🔥 VERIFY TOKEN WITH BACKEND */
        const res = await API.get("/auth/me");

        const userData = res.data?.user;

        if (!userData) throw new Error("Invalid user");

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

      } catch (error) {

        console.log("Auto login failed");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

      } finally {
        setLoading(false);
      }
    };

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
     🔐 LOGIN (UPDATED 🔥)
  ===================================== */
  const login = async (data) => {

    try {

      /* 🔥 CASE 1: TOKEN */
      if (typeof data === "string") {

        localStorage.setItem("token", data);

        const res = await API.get("/auth/me");
        const userData = res.data?.user;

        if (!userData) throw new Error("User not found");

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return;
      }

      /* 🔥 CASE 2: USER + TOKEN OBJECT */
      if (typeof data === "object") {

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          return;
        }

        /* fallback */
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }

    } catch (error) {

      console.log("Login failed");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    }
  };

  /* =====================================
     🚪 LOGOUT
  ===================================== */
  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
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