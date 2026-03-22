import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api"; // 🔥 ADD THIS

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================
     🔄 LOAD USER (🔥 FROM BACKEND)
  ===================================== */
  useEffect(() => {

    const loadUser = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // 🔥 FETCH FROM BACKEND
        const res = await API.get("/auth/me");

        const userData = res.data?.data;

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

      } catch (error) {

        console.log("User load failed");

        // ❌ invalid token → clear
        localStorage.removeItem("token");
        localStorage.removeItem("user");

      } finally {
        setLoading(false);
      }

    };

    loadUser();

  }, []);

  /* =====================================
     🔐 LOGIN
  ===================================== */
  const login = (userData) => {

    if (!userData) return;

    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
  };

  /* =====================================
     🚪 LOGOUT
  ===================================== */
  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* =====================================
     ⏳ LOADING BLOCK (IMPORTANT)
  ===================================== */
  if (loading) {
    return null; // ya loader dikha sakta hai
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);