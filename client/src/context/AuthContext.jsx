import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔹 Load saved user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Login after OTP verify
  const login = ({ phone }) => {
    const newUser = {
      id: Date.now(),        // temporary id (backend se replace hoga)
      name: "Student",       // default name
      phone: phone
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
