import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {

  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);

  /* 🔑 UNIQUE STORAGE KEY */
  const getStorageKey = () =>
    user ? `cart_${user._id}` : "cart_guest";

  /* 📦 LOAD FROM STORAGE */
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      setCartItems(JSON.parse(saved));
    } else {
      setCartItems([]);
    }
  }, [user]);

  /* 💾 SAVE TO STORAGE */
  const saveCart = (items) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
    setCartItems(items);
  };

  /* ➕ ADD TO CART (NO DUPLICATE) */
  const addToCart = (product) => {

    if (!product || !product._id) return;

    setCartItems((prev) => {

      const exists = prev.find((item) => item._id === product._id);

      if (exists) {
        return prev; // ❌ duplicate block
      }

      const updated = [...prev, product];

      localStorage.setItem(getStorageKey(), JSON.stringify(updated));

      return updated;
    });
  };

  /* ❌ REMOVE */
  const removeFromCart = (id) => {

    setCartItems((prev) => {

      const updated = prev.filter((item) => item._id !== id);

      localStorage.setItem(getStorageKey(), JSON.stringify(updated));

      return updated;
    });
  };

  /* 🧹 CLEAR CART */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(getStorageKey());
  };

  /* 💰 TOTAL */
  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* 🔥 SAFE HOOK */
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};