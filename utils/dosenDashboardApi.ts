/**
 * Dosen Dashboard API Client
 * Utility functions untuk mengambil data dashboard dosen dari backend API
 */

import { api } from "@/utils/api";
import {
  DosenStats,
  UpcomingSchedule,
  GuidedStudent,
  GuidedStudentSummary,
  Announcement,
  DosenDashboardData,
} from "@/types/dosen-dashboard";

const BASE_ENDPOINT = "/dosen/dashboard";

export const dosenDashboardApi = {
  /**
   * Get dosen statistics
   * @returns DosenStats - Statistik dosen (pendaftar baru, mahasiswa aktif, dll)
   */
  getStats: async (): Promise<DosenStats> => {
    try {
      const response = await api.get(`${BASE_ENDPOINT}/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching dosen stats:", error);
      throw error;
    }
  },

  /**
   * Get upcoming schedules for dosen
   * @param limit - Jumlah jadwal yang diambil (opsional)
   * @returns UpcomingSchedule[] - Daftar jadwal sidang mendatang
   */
  getUpcomingSchedules: async (limit?: number): Promise<UpcomingSchedule[]> => {
    try {
      const endpoint = limit
        ? `${BASE_ENDPOINT}/schedules?limit=${limit}`
        : `${BASE_ENDPOINT}/schedules`;
      const response = await api.get(endpoint);
      if (!response.ok) throw new Error("Failed to fetch schedules");
      const data = await response.json();
      return Array.isArray(data.data) ? data.data : data;
    } catch (error) {
      console.error("Error fetching upcoming schedules:", error);
      throw error;
    }
  },

  /**
   * Get all guided students
   * @param status - Filter berdasarkan status (opsional)
   * @returns GuidedStudent[] - Daftar mahasiswa bimbingan
   */
  getGuidedStudents: async (status?: string): Promise<GuidedStudent[]> => {
    try {
      const endpoint = status
        ? `${BASE_ENDPOINT}/students?status=${status}`
        : `${BASE_ENDPOINT}/students`;
      const response = await api.get(endpoint);
      if (!response.ok) throw new Error("Failed to fetch guided students");
      const data = await response.json();
      return Array.isArray(data.data) ? data.data : data;
    } catch (error) {
      console.error("Error fetching guided students:", error);
      throw error;
    }
  },

  /**
   * Get guided students summary
   * @returns GuidedStudentSummary[] - Ringkasan mahasiswa bimbingan per jenis sidang
   */
  getGuidedStudentsSummary: async (): Promise<GuidedStudentSummary[]> => {
    try {
      const response = await api.get(`${BASE_ENDPOINT}/students/summary`);
      if (!response.ok) throw new Error("Failed to fetch students summary");
      const data = await response.json();
      return Array.isArray(data.data) ? data.data : data;
    } catch (error) {
      console.error("Error fetching guided students summary:", error);
      throw error;
    }
  },

  /**
   * Get announcements
   * @returns Announcement[] - Daftar pengumuman penting
   */
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const response = await api.get(`${BASE_ENDPOINT}/announcements`);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      return Array.isArray(data.data) ? data.data : data;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  /**
   * Get complete dashboard data
   * Mengambil semua data dashboard dalam satu request
   * @returns DosenDashboardData - Semua data yang diperlukan dashboard
   */
  getDashboardData: async (): Promise<DosenDashboardData> => {
    try {
      const response = await api.get(`${BASE_ENDPOINT}`);
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  /**
   * Get dosen profile info
   * @returns Profil dosen yang login
   */
  getDosenProfile: async () => {
    try {
      const response = await api.get("/dosen/profile");
      if (!response.ok) throw new Error("Failed to fetch dosen profile");
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching dosen profile:", error);
      throw error;
    }
  },
};

export default dosenDashboardApi;
