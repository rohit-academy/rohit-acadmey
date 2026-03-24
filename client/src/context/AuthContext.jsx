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

        const userData = res.data?.user; // ✅ FIXED

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          throw new Error("Invalid user");
        }

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

  }, []);

  /* =====================================
     🔐 LOGIN
     - supports token OR user
  ===================================== */
  const login = async (data) => {

    try {

      /* 🔥 CASE 1: TOKEN PASSED */
      if (typeof data === "string") {

        localStorage.setItem("token", data);

        const res = await API.get("/auth/me");
        const userData = res.data?.user;

        if (!userData) throw new Error("User not found");

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return;
      }

      /* 🔥 CASE 2: USER PASSED (Google flow) */
      if (typeof data === "object") {

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));

        return;
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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================
   🔹 HOOK
===================================== */
export const useAuth = () => useContext(AuthContext);