import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";

import SearchBar from "../ui/SearchBar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function DesktopNavbar() {

  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* 🔍 SEARCH */
  const handleSearch = (query) => {
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  /* 🛒 SAFE COUNT */
  const cartCount =
    cartItems.length > 99 ? "99+" : cartItems.length;

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    if (window.confirm("Logout from your account?")) {
      logout();
      navigate("/login");
    }
  };

  return (

    <nav className="bg-white shadow-sm border-b z-50 hidden md:block">

      <div className="container mx-auto flex items-center justify-between py-3 px-6">

        {/* 🔵 LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-wide hover:scale-105 transition"
        >
          Rohit Academy
        </Link>

        {/* 🟢 SEARCH */}
        <div className="w-[40%] max-w-lg">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 🔴 RIGHT */}
        <div className="flex items-center gap-6">

          {/* 🛒 CART */}
          <Link
            to="/cart"
            className="relative group"
            aria-label="Cart"
          >
            <ShoppingCart
              size={24}
              className="group-hover:text-blue-600 transition"
            />

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 👤 USER */}
          {user ? (

            <div className="flex items-center gap-3">

              {/* USER BUTTON (FIXED div → button) */}
              <button
                onClick={() => navigate("/account")}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full text-blue-700 font-medium transition max-w-[180px]"
                aria-label="Go to account"
              >
                <User size={18} />

                <span className="truncate">
                  {user.name || user.email || user.phone}
                </span>
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>

            </div>

          ) : (

            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium shadow-sm"
            >
              Login
            </Link>

          )}

        </div>

      </div>

    </nav>

  );
}

export default React.memo(DesktopNavbar);