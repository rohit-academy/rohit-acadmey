import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

import SearchBar from "../ui/SearchBar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function DesktopNavbar() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    console.log("Searching:", query);
    // yaha future me search page navigate kar sakte ho
    // navigate(`/search?q=${query}`)
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 hidden md:block">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">

        {/* 🔵 LEFT LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-wide"
        >
          Rohit Academy
        </Link>

        {/* 🟢 CENTER SEARCH */}
        <div className="flex items-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 🔴 RIGHT SECTION */}
        <div className="flex items-center gap-8">

          {/* 🛒 CART */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="hover:text-blue-600 transition" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* 👤 USER / LOGIN */}
          {user ? (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 font-semibold">
              <User size={18} />
              {user.name}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default DesktopNavbar;
