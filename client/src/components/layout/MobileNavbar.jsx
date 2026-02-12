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
            <SearchBar onSearch={handleSearch} autoFocus={true} />
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

      {/* 🔥 OVERLAY + FLOATING MENU */}
      {menuOpen && (
        <>
          {/* Background blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Floating Card */}
          <div className="fixed top-5 right-5 w-[86%] max-w-xs bg-white rounded-2xl shadow-2xl z-50 p-5 transition-all duration-300 ease-out scale-100">

            {/* Close */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-[15px]">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                <Home size={18} />
                Home
              </Link>

              <Link
                to="/downloads"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                <Download size={18} />
                My Downloads
              </Link>

              <div className="border-t my-3 opacity-60" />

              {user ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-xl border text-sm space-y-2">
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
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition"
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
