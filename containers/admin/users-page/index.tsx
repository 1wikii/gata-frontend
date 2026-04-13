"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { api } from "@/utils/api";
import { User, UserFormState, UserRole } from "@/types/users";
import Loading from "@/components/ui/loading";
import { UsersTable } from "./UsersTable";
import { UserFormModal } from "./UserFormModal";
import { FilterSearch } from "./FilterSearch";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch users data
  const fetchUsers = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query string
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (roleFilter !== "all") {
        params.append("role", roleFilter);
      }

      if (searchTerm.trim()) {
        params.append("search", searchTerm);
      }

      const response = await api.get(`/admin/users?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
          setCurrentPage(result.pagination.page || 1);
        }
      } else {
        setError("Gagal memuat data users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(1);
  }, [searchTerm, roleFilter]);

  // Handle add new user
  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData: UserFormState) => {
    try {
      const payload: any = {
        role: formData.role,
        email: formData.email,
        name: formData.name,
      };

      // Add optional fields
      if (formData.nip) {
        payload.nip = formData.nip;
      }
      if (formData.nim) {
        payload.nim = formData.nim;
      }
      if (formData.initials) {
        payload.initials = formData.initials;
      }
      if (formData.whatsapp_number) {
        payload.whatsapp_number = formData.whatsapp_number;
      }

      // Add password for create mode only
      if (!editingUser) {
        payload.password = formData.password;
      }

      if (editingUser) {
        // Update user
        const response = await api.put(
          `/admin/users/${editingUser.id}`,
          payload
        );

        if (response.ok) {
          // Refresh data
          await fetchUsers(currentPage);
          console.log("User updated successfully");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengupdate user");
        }
      } else {
        // Create new user
        const response = await api.post("/admin/users", payload);

        if (response.ok) {
          // Refresh data
          await fetchUsers(1);
          setCurrentPage(1);
          console.log("User created successfully");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal membuat user");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      throw err;
    }
  };

  // Handle delete user
  const handleDeleteUser = async (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!editingUser) return;

    try {
      const response = await api.delete(`/admin/users/${editingUser.id}`);

      if (response.ok) {
        // Refresh data
        await fetchUsers(currentPage);
        console.log("User deleted successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchUsers(newPage);
  };

  if (isLoading && users.length === 0) {
    return <Loading />;
  }

  return (
    <div className="content-section w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">Manajemen Users</h2>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Tambah User
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => fetchUsers(currentPage)}
            className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <FilterSearch
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Total users: <span className="font-semibold">{users.length}</span> per
        halaman
      </div>

      {/* Table */}
      <UsersTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default UsersPage;
