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
    <nav className="bg-white shadow-md sticky top-0 z-50 md:hidden">

      <div className="flex items-center justify-between px-4 py-3 gap-2">

        {/* LEFT SIDE */}
        <div className="flex-1 mobile-search-area">
          {!showSearch ? (
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 whitespace-nowrap"
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
          <div className="flex items-center gap-4 shrink-0">

            <button
              onClick={() => setShowSearch(true)}
              className="p-1"
            >
              <Search size={22} />
            </button>

            <Link to="/cart" className="relative p-1">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-1"
            >
              <Menu size={26} />
            </button>

          </div>
        )}
      </div>

      {/* 🔥 OVERLAY */}
      {menuOpen && (
        <>
          {/* Background dim */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Chrome style floating sidebar */}
          <div className="fixed top-3 right-3 w-[85%] max-w-xs bg-white rounded-2xl shadow-2xl z-50 animate-slideIn p-4">

            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-base">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg"
              >
                <Home size={18} /> Home
              </Link>

              <Link
                to="/downloads"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg"
              >
                <Download size={18} /> My Downloads
              </Link>

              <div className="border-t my-2" />

              {user ? (
                <>
                  <div className="bg-blue-50 p-3 rounded-xl border text-sm">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold">
                      <User size={18} />
                      {user.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
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
                    className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
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

export default MobileNavbar;
