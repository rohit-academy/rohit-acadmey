import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Home,
  Download,
  User,
  LogOut,
  LogIn
} from "lucide-react";

import SearchBar from "../ui/SearchBar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function MobileNavbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  /* 🔒 SCROLL LOCK FIX */
  useEffect(() => {
    const original = document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  /* 🔄 CLOSE MENU ON ROUTE CHANGE */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ⌨️ ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowSearch(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* 🔍 SEARCH */
  const handleSearch = (query) => {
    console.log("Searching:", query);
    setShowSearch(false);
    navigate(`/search?q=${encodeURIComponent(query)}`); // 🔥 future ready
  };

  /* 🛒 SAFE COUNT */
  const cartCount =
    cartItems.length > 99 ? "99+" : cartItems.length;

  return (

    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 md:hidden">

      {/* 🔝 TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">

        {/* LEFT */}
        <div className="flex-1">

          {!showSearch ? (
            <Link
              to="/"
              className="text-lg font-semibold text-blue-600 tracking-tight"
            >
              Rohit Academy
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <SearchBar onSearch={handleSearch} autoFocus />
              <button
                onClick={() => setShowSearch(false)}
                className="p-2"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
          )}

        </div>

        {/* RIGHT */}
        {!showSearch && (
          <div className="flex items-center gap-4 ml-2">

            {/* 🔍 SEARCH */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* 🛒 CART */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 active:scale-95"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />

              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ☰ MENU */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

          </div>
        )}
      </div>

      {/* 🔥 SIDEBAR */}
      {menuOpen && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="fixed top-6 right-4 w-[70%] max-w-[260px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideInRight">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-white">

              <div>
                <p className="text-xs text-gray-500">Menu</p>
                <h3 className="text-base font-semibold text-blue-600">
                  Rohit Academy
                </h3>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* MENU */}
            <div className="flex flex-col py-2">

              <Link to="/" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100">
                <Home size={18} /> Home
              </Link>

              {user && (
                <Link to="/account" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100">
                  <User size={18} /> My Account
                </Link>
              )}

              <Link to="/downloads" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100">
                <Download size={18} /> My Downloads
              </Link>

              <div className="border-t my-2 opacity-50" />

              {user ? (
                <>
                  <div className="px-5 py-3 bg-blue-50 text-sm">
                    <p className="font-semibold">{user.name || "Student"}</p>
                    <p className="text-xs text-gray-600 break-all">
                      {user.email || user.phone}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100">
                  <LogIn size={18} /> Login
                </Link>
              )}

            </div>

          </div>
        </>
      )}

    </nav>
  );
}

export default React.memo(MobileNavbar);