"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { announcementApi } from "@/utils/announcementApi";
import {
  Announcement,
  AnnouncementFormState,
  PaginationData,
} from "@/types/pengumuman";
import Loading from "@/components/ui/loading";
import { AnnouncementTable } from "./AnnouncementTable";
import { AnnouncementFormModal } from "./AnnouncementFormModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { FilterSearch } from "./FilterSearch";
import { AnnouncementStats } from "./AnnouncementStats";

const PengumumanPage = () => {
  // State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [publishFilter, setPublishFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "high">(
    "all"
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const itemsPerPage = 10;

  // Fetch announcements
  const fetchAnnouncements = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: any = {};

      if (searchTerm.trim()) {
        filters.search = searchTerm;
      }

      if (publishFilter !== "all") {
        filters.is_published = publishFilter === "published";
      }

      if (priorityFilter !== "all") {
        filters.priority = priorityFilter;
      }

      filters.sortBy = "created_at";
      filters.sortOrder = "DESC";

      const response = await announcementApi.getAll(
        page,
        itemsPerPage,
        filters
      );

      if (response.ok) {
        const result = await response.json();
        setAnnouncements(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
          setCurrentPage(result.pagination.page || 1);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Gagal memuat data pengumuman");
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchAnnouncements(1);
  }, [searchTerm, publishFilter, priorityFilter]);

  // Handlers
  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setIsFormModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAnnouncementToDelete(null);
  };

  const handleFormSubmit = async (formData: AnnouncementFormState) => {
    try {
      if (editingAnnouncement) {
        // Update
        const response = await announcementApi.update(
          editingAnnouncement.id,
          formData
        );

        if (response.ok) {
          await fetchAnnouncements(currentPage);
          console.log("Pengumuman berhasil diupdate");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengupdate pengumuman");
        }
      } else {
        // Create
        const response = await announcementApi.create(formData);

        if (response.ok) {
          await fetchAnnouncements(1);
          setCurrentPage(1);
          console.log("Pengumuman berhasil dibuat");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal membuat pengumuman");
        }
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;

    try {
      const response = await announcementApi.delete(announcementToDelete.id);

      if (response.ok) {
        await fetchAnnouncements(currentPage);
        console.log("Pengumuman berhasil dihapus");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus pengumuman");
      }
    } catch (err: any) {
      console.error("Error deleting announcement:", err);
      throw err;
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAnnouncements(newPage);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPublishFilter("all");
    setPriorityFilter("all");
    setCurrentPage(1);
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: pagination.total,
      published: announcements.filter((a) => a.is_published).length,
      draft: announcements.filter((a) => !a.is_published).length,
      highPriority: announcements.filter((a) => a.priority === "high").length,
    };
  }, [announcements, pagination.total]);

  if (isLoading && announcements.length === 0) {
    return <Loading />;
  }

  return (
    <div className="content-section w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">
          Manajemen Pengumuman
        </h2>
        <button
          onClick={handleAddAnnouncement}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Tambah Pengumuman
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => fetchAnnouncements(currentPage)}
            className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Stats */}
      <AnnouncementStats
        totalAnnouncements={stats.total}
        publishedAnnouncements={stats.published}
        draftAnnouncements={stats.draft}
        highPriorityAnnouncements={stats.highPriority}
      />

      {/* Filter and Search */}
      <FilterSearch
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        publishFilter={publishFilter}
        onPublishFilterChange={setPublishFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Menampilkan{" "}
        <span className="font-semibold">{announcements.length}</span> dari{" "}
        <span className="font-semibold">{pagination.total}</span> pengumuman
      </div>

      {/* Table */}
      <AnnouncementTable
        announcements={announcements}
        onEdit={handleEditAnnouncement}
        onDelete={handleDeleteAnnouncement}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Sebelumnya
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
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
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* Modals */}
      <AnnouncementFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        editingAnnouncement={editingAnnouncement}
        isLoading={isLoading}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        announcement={announcementToDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PengumumanPage;
