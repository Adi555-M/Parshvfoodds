import React from 'react';
import { Search, Clock } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
}: SearchFilterProps) {
  return (
    <section className="px-4 py-4 max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto flex flex-col gap-4.5 select-none">
      {/* Search Input Box (Elegant rounded corners) */}
      <div className="relative w-full">
        <label htmlFor="veg-search-input" className="sr-only">Search vegetable name</label>
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          id="veg-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vegetables..."
          className="w-full bg-white text-gray-800 pl-11 pr-12 py-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#2E7D32]/60 focus:ring-1 focus:ring-[#2E7D32]/25 shadow-xs transition-all placeholder:text-gray-400 font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-red-500 hover:text-red-700 font-bold active:scale-95 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Clock Banner Header info card (Beautiful rounded corners) */}
      <div className="w-full bg-[#EAF6EA]/70 border border-[#C8EBC8]/50 p-4 flex items-start gap-3.5 shadow-xs select-none rounded-2xl">
        <Clock className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-gray-800 leading-tight">
            Today's Fresh Selection
          </h2>
          <p className="text-xs font-medium text-gray-650 mt-1 leading-relaxed">
            Prices and availability are updated daily at 4AM directly from Surat wholesale farm markets.
          </p>
        </div>
      </div>
    </section>
  );
}
