import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

function SearchBar({
  placeholder = "Search notes, papers, syllabus...",
  onSearch,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch && onSearch(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
      setOpen(false);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch && onSearch("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      
      {/* 🔍 Icon Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Search size={22} className="text-gray-600" />
      </button>

      {/* ✨ LEFT EXPANDING SEARCH BOX */}
      <div
        className={`
          absolute right-full mr-2 top-1/2 -translate-y-1/2
          transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
          origin-right
          ${open
            ? "w-[280px] sm:w-[420px] opacity-100 scale-100"
            : "w-0 opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200 rounded-full flex items-center px-4 py-2">

          <Search size={18} className="text-gray-400 mr-2" />

          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
