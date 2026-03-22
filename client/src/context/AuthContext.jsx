import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  /* =====================================
     🔄 LOAD USER FROM LOCALSTORAGE
  ===================================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* =====================================
     🔐 LOGIN (🔥 FIXED)
     - accepts full user from backend
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
    localStorage.removeItem("token"); // 🔥 IMPORTANT
  };

  /* =====================================
     📌 VALUE
  ===================================== */
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