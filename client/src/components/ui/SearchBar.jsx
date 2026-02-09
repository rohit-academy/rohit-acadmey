import React, { useState } from "react";
import { Search, X } from "lucide-react";

function SearchBar({ placeholder = "Search notes, papers, syllabus...", onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    if (onSearch) onSearch(query.trim());
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full px-4 mt-8">

      {/* ✨ Background Glow */}
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-3xl"></div>

        {/* 🔍 Main Container */}
        <div className="relative bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-lg overflow-hidden transition focus-within:shadow-blue-200">

          <div className="flex flex-col sm:flex-row items-stretch">

            {/* Input Area */}
            <div className="flex items-center flex-1 px-5 py-4">
              <Search className="text-blue-500 mr-3" size={20} />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />

              {query && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Button */}
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 sm:py-0 font-semibold tracking-wide hover:scale-[1.02] active:scale-95 transition"
            >
              Search
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
