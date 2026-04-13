"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  publishFilter: "all" | "published" | "draft";
  onPublishFilterChange: (value: "all" | "published" | "draft") => void;
  priorityFilter: "all" | "low" | "high";
  onPriorityFilterChange: (value: "all" | "low" | "high") => void;
  onResetFilters: () => void;
}

export const FilterSearch: React.FC<FilterSearchProps> = ({
  searchValue,
  onSearchChange,
  publishFilter,
  onPublishFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onResetFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const hasActiveFilters =
    searchValue !== "" || publishFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari pengumuman berdasarkan judul atau konten..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <X className="w-4 h-4" />
            Reset Filter
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Publish Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Publikasi
              </label>
              <select
                value={publishFilter}
                onChange={(e) =>
                  onPublishFilterChange(
                    e.target.value as "all" | "published" | "draft"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua</option>
                <option value="published">Dipublikasi</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prioritas
              </label>
              <select
                value={priorityFilter}
                onChange={(e) =>
                  onPriorityFilterChange(
                    e.target.value as "all" | "low" | "high"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua</option>
                <option value="low">Rendah</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
