import React from "react";
import { Search, X } from "lucide-react";
import { UserRole } from "@/types/users";

interface FilterSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  roleFilter: UserRole | "all";
  onRoleFilterChange: (role: UserRole | "all") => void;
  onResetFilters: () => void;
}

export const FilterSearch: React.FC<FilterSearchProps> = ({
  searchValue,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchValue.trim() !== "" || roleFilter !== "all";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan Name, Email, atau NIP/NIM..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Filter by Role:
          </label>
          <select
            value={roleFilter}
            onChange={(e) =>
              onRoleFilterChange(e.target.value as UserRole | "all")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="lecturer">Dosen</option>
            <option value="student">Mahasiswa</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
};
