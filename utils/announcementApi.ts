import { api } from "./api";
import { Announcement, AnnouncementFormState } from "@/types/pengumuman";

export const announcementApi = {
  // Get all announcements with pagination and filters
  getAll: async (
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      is_published?: boolean;
      priority?: "low" | "high";
      sortBy?: string;
      sortOrder?: "ASC" | "DESC";
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.is_published !== undefined) {
      params.append("is_published", filters.is_published.toString());
    }
    if (filters?.priority) {
      params.append("priority", filters.priority);
    }
    if (filters?.sortBy) {
      params.append("sortBy", filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append("sortOrder", filters.sortOrder);
    }

    const response = await api.get(`/admin/pengumuman?${params.toString()}`);
    return response;
  },

  // Get announcement by ID
  getById: async (id: number) => {
    const response = await api.get(`/admin/pengumuman/${id}`);
    return response;
  },

  // Create new announcement
  create: async (data: AnnouncementFormState) => {
    const response = await api.post("/admin/pengumuman", data);
    return response;
  },

  // Update announcement
  update: async (id: number, data: Partial<AnnouncementFormState>) => {
    const response = await api.put(`/admin/pengumuman/${id}`, data);
    return response;
  },

  // Delete announcement
  delete: async (id: number) => {
    const response = await api.delete(`/admin/pengumuman/${id}`);
    return response;
  },
};
