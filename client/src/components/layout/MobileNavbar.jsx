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
    <nav className="bg-white shadow-sm sticky top-0 z-50 md:hidden">

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
            <SearchBar
              onSearch={handleSearch}
              autoFocus={true}
            />
          )}
        </div>

        {/* RIGHT ICONS */}
        {!showSearch && (
          <div className="flex items-center gap-5 shrink-0 ml-3">

            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Search size={22} />
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Menu size={24} />
            </button>

          </div>
        )}
      </div>

      {/* 🔥 OVERLAY + FLOATING MENU */}
      {menuOpen && (
        <>
          {/* Background blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Floating Card */}
          <div className="fixed top-4 right-4 w-[88%] max-w-xs bg-white rounded-2xl shadow-2xl z-50 p-5 animate-slideIn">

            {/* Close */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-[15px]">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link
                to="/downloads"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition"
              >
                <Download size={18} />
                <span>My Downloads</span>
              </Link>

              <div className="border-t my-2 opacity-70" />

              {user ? (
                <>
                  <div className="bg-blue-50 p-3 rounded-xl border text-sm space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold">
                      <User size={16} />
                      <span>{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition"
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