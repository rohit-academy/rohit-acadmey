import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  BookOpen,
  LogIn,
  Home,
  Download,
  User,
  LogOut,
  Phone
} from "lucide-react";

import SearchBar from "../ui/SearchBar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  // 🔒 Prevent background scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 gap-4">

        <Link to="/" className="text-xl font-bold text-blue-600 whitespace-nowrap">
          Rohit Academy
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            to="/classes"
            className={`${isActive("/classes") ? "text-blue-600 font-semibold" : "hover:text-blue-600"}`}
          >
            Classes
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-semibold">
              <User size={18} /> {user.name}
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleSearch} className="p-1">
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

          <button onClick={toggleMenu} className="p-1">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden bg-white p-4 shadow">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4 text-lg animate-slideDown">

          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
            <Home size={20} /> Home
          </Link>

          <Link to="/classes" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
            <BookOpen size={20} /> Classes
          </Link>

          <Link to="/downloads" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
            <Download size={20} /> My Downloads
          </Link>

          {user ? (
            <>
              <div className="bg-blue-50 p-4 rounded-xl border">
                <div className="flex items-center gap-3 text-blue-700 font-semibold">
                  <User size={22} />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 mt-2 text-sm">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/");
                }}
                className="flex items-center gap-3 text-red-500"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
              <LogIn size={20} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
