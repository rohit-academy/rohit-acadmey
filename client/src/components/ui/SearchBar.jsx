import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

function SearchBar({
  placeholder = "Search notes, papers, syllabus...",
  onSearch,
  autoFocus = false   // ⭐ parent control karega
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  /* 🔍 Search */
  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch && onSearch(trimmed);
  };

  /* ⌨️ Keys */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  /* ❌ Clear */
  const clearSearch = () => {
    setQuery("");
    onSearch && onSearch("");
    inputRef.current?.focus();
  };

  /* 🎯 Auto Focus (mobile fix) */
  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <div className="bg-white shadow-md border rounded-full flex items-center px-4 py-2 w-full">

      <Search size={18} className="text-gray-400 mr-2" />

      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700"
      />

      {query && (
        <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
