import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Home,
  Download,
  User,
  LogOut,
  Phone,
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

  const handleSearch = (query) => {
    console.log("Searching:", query);
    setShowSearch(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 md:hidden">

      {/* 🔝 TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">

        {/* LEFT */}
        <div className="flex-1 mobile-search-area">
          {!showSearch ? (
            <Link
              to="/"
              className="text-lg font-semibold text-blue-600 tracking-tight"
            >
              Rohit Academy
            </Link>
          ) : (
            <SearchBar onSearch={handleSearch} autoFocus />
          )}
        </div>

        {/* RIGHT ICONS */}
        {!showSearch && (
          <div className="flex items-center gap-4 shrink-0 ml-2">

            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            >
              <Search size={22} />
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            >
              <Menu size={24} />
            </button>

          </div>
        )}
      </div>

      {/* 🔥 OVERLAY + SIDEBAR */}
      {menuOpen && (
        <>
          {/* Background Blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar Card */}
          <div className="fixed top-6 right-4 w-[80%] max-w-[280px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">

            {/* 🔹 Sidebar Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-white">

              <div>
                <p className="text-sm text-gray-500">Menu</p>
                <h3 className="text-base font-semibold text-blue-600">
                  Rohit Academy
                </h3>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* 🔹 Menu Items */}
            <div className="flex flex-col py-3">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition"
              >
                <Home size={18} />
                Home
              </Link>

              <Link
                to="/downloads"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition"
              >
                <Download size={18} />
                My Downloads
              </Link>

              <div className="border-t my-2 opacity-60" />

              {user ? (
                <>
                  <div className="px-5 py-3 bg-blue-50 text-sm space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold">
                      <User size={16} />
                      {user.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      {user.phone}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              )}

            </div>
          </div>
        </>
      )}

    </nav>
  );
}

export default MobileNavbar;
