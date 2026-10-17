"use client";

import React, { memo } from "react";
import { Search, X } from "lucide-react";

interface SearchControlProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchesCount: number;
  totalCount: number;
}

const SearchControlComponent: React.FC<SearchControlProps> = ({
  searchQuery,
  onSearchChange,
  matchesCount,
  totalCount,
}) => {
  return (
    <div className="relative flex-1 min-w-[240px] max-w-md">
      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search Project, Scheme, District, State, NGO, ID, Inspector..."
        className="w-full pl-8 pr-16 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchQuery ? (
          <button
            onClick={() => onSearchChange("")}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono pr-1">
            {matchesCount}/{totalCount}
          </span>
        )}
      </div>
    </div>
  );
};

export const SearchControl = memo(SearchControlComponent);
