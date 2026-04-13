/**
 * Admin Dashboard API Client
 * Utility functions untuk mengambil data dashboard admin dari backend API
 */

import { api } from "@/utils/api";

const BASE_ENDPOINT = "/admin/dashboard";
const ADMIN_ENDPOINT = "/admin";

// Types
export interface DashboardStats {
  mahasiswa: {
    total: number;
    terdaftar_semester_ini: number;
    persentase_pertumbuhan: number;
    status_breakdown: {
      aktif: number;
      cuti: number;
      lulus: number;
    };
  };
  dosen: {
    total: number;
    aktif: number;
    tersedia_bimbingan: number;
    status_breakdown: {
      aktif: number;
      tidak_aktif: number;
      cuti: number;
    };
  };
  jadwal_sidang: {
    total_minggu_ini: number;
    total_bulan_ini: number;
    belum_dijadwalkan: number;
    status_breakdown: {
      terjadwal: number;
      selesai: number;
      dibatalkan: number;
    };
  };
  pengumuman: {
    total: number;
    pending: number;
    dipublikasikan: number;
    terbaru: {
      id: string;
      judul: string;
      created_at: string;
    };
  };
  periode_aktif: {
    semester: string;
    tahun_akademik: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
    status: string;
  };
  summary: {
    mahasiswa_baru: number;
    sidang_selesai: number;
    tingkat_penyelesaian: string;
  };
}

export interface SystemStatus {
  api_server: "online" | "offline";
  database: "online" | "offline";
  scheduler: "online" | "offline";
}

export interface QuickStat {
  category: string;
  label: string;
  value: number;
  total: number;
  percentage: number;
  trend: string;
  trend_percentage: number;
  last_updated: string;
}

export interface PeriodeInfo {
  id: string;
  semester: string;
  tahun_akademik: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  deskripsi: string;
  konfigurasi: {
    max_mahasiswa: number;
    min_dosen: number;
    durasi_bimbingan_minggu: number;
  };
}

export interface DosenVerificationStatus {
  total_dosen: number;
  terverifikasi: number;
  belum_terverifikasi: number;
  status: string;
  persentase_verifikasi: number;
  tanggal_selesai: string;
  detail_data: {
    data_lengkap: number;
    sertifikat_valid: number;
    kontak_terverifikasi: number;
  };
}

export interface JadwalSidangStatus {
  total_terjadwal_minggu_ini: number;
  hari_pertama_sidang: string;
  status: string;
  ruang_tersedia: boolean;
  daftar_sidang: Array<{
    id: string;
    mahasiswa_nim: string;
    judul_ta: string;
    pembimbing_1: string;
    pembimbing_2: string;
    tanggal_sidang: string;
    ruang: string;
    status: string;
  }>;
}

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  priority?: "high" | "low";
  author?: string;
  status?: string;
  judul?: string;
  deskripsi?: string;
  konten?: string;
  tanggal_dibuat?: string;
  tanggal_diubah?: string;
  tanggal_dipublikasikan?: string;
  created_at?: string;
  updated_at?: string;
  ditujukan_ke?: string[];
  attachment?: {
    nama_file: string;
    url: string;
  };
}

export interface AnnouncementResponse {
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  data: Announcement[] | Announcement;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
  nim_nidn: string;
  status: string;
  tanggal_dibuat: string;
  last_login: string;
  profil_lengkap?: {
    no_telepon: string;
    alamat: string;
    prodi: string;
  };
}

export interface UsersResponse {
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  data: User[] | User;
}

export interface FinalProject {
  id: string;
  mahasiswa_nim: string;
  mahasiswa_nama: string;
  judul: string;
  status: string;
  pembimbing_1: {
    id: string;
    nama: string;
    email?: string;
  };
  pembimbing_2?: {
    id: string;
    nama: string;
    email?: string;
  };
  tanggal_mulai: string;
  tanggal_selesai?: string;
  progress: number;
  sessions_count?: number;
  revisions_count?: number;
  file_proposal?: string;
}

export interface FinalProjectResponse {
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  data: FinalProject[] | FinalProject;
}

export interface ExaminationSchedule {
  id: string;
  mahasiswa_nim: string;
  mahasiswa_nama: string;
  email_mahasiswa?: string;
  judul_ta: string;
  jenis_sidang: string;
  status: string;
  tanggal: string;
  jam_mulai?: string;
  durasi_menit: number;
  ruang: string;
  gedung?: string;
  penguji_1: {
    id: string;
    nama: string;
    role?: string;
  };
  penguji_2?: {
    id: string;
    nama: string;
    role?: string;
  };
  penguji_3?: {
    id: string;
    nama: string;
    role?: string;
  };
  catatan?: string;
}

export interface ExaminationScheduleResponse {
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  data: ExaminationSchedule[] | ExaminationSchedule;
}

export interface AssessmentRubric {
  id: string;
  nama: string;
  jenis_sidang: string;
  status: string;
  total_kriteria: number;
  bobot_total: number;
  tanggal_dibuat: string;
  tanggal_diubah?: string;
  deskripsi?: string;
  kriteria?: Array<{
    id: string;
    nama: string;
    bobot: number;
    deskripsi: string;
    skala?: Array<{
      nilai: number;
      label: string;
      range: string;
    }>;
  }>;
}

export interface AssessmentRubricResponse {
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  data: AssessmentRubric[] | AssessmentRubric;
}

// API Functions

/**
 * Get admin dashboard statistics
 * @returns DashboardStats - Statistik lengkap dashboard
 */
export const getAdminDashboardStats = async (
  semester?: string,
  tahunAkademik?: string
): Promise<DashboardStats> => {
  try {
    let endpoint = `${BASE_ENDPOINT}/stats`;
    const params = new URLSearchParams();

    if (semester) params.append("semester", semester);
    if (tahunAkademik) params.append("tahun_akademik", tahunAkademik);

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch stats");

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    throw error;
  }
};

/**
 * Get system status overview
 * @returns SystemStatus - Status sistem (API, Database, Storage)
 */
export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    const response = await api.get(`${BASE_ENDPOINT}/system-status`);
    if (!response.ok) throw new Error("Failed to fetch system status");

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching system status:", error);
    throw error;
  }
};

/**
 * Get quick stats for a specific category
 * @param category - "mahasiswa_baru" | "dosen_aktif" | "sidang_selesai" | "sidang_terjadwal"
 * @returns QuickStat - Statistik cepat
 */
export const getQuickStat = async (category: string): Promise<QuickStat> => {
  try {
    const response = await api.get(`${BASE_ENDPOINT}/quick-stats/${category}`);
    if (!response.ok) throw new Error("Failed to fetch quick stat");

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching quick stat:", error);
    throw error;
  }
};

/**
 * Get periode information
 * @returns PeriodeInfo - Informasi periode akademik aktif
 */
export const getPeriodeInfo = async (): Promise<PeriodeInfo> => {
  try {
    const response = await api.get(`${BASE_ENDPOINT}/periode-info`);
    if (!response.ok) throw new Error("Failed to fetch periode info");

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching periode info:", error);
    throw error;
  }
};

/**
 * Get dosen verification status
 * @returns DosenVerificationStatus - Status verifikasi dosen
 */
export const getDosenVerificationStatus =
  async (): Promise<DosenVerificationStatus> => {
    try {
      const response = await api.get(
        `${BASE_ENDPOINT}/dosen-verification-status`
      );
      if (!response.ok)
        throw new Error("Failed to fetch dosen verification status");

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching dosen verification status:", error);
      throw error;
    }
  };

/**
 * Get jadwal sidang status
 * @param minggudepan - boolean, ambil jadwal minggu depan
 * @param bulan - filter berdasarkan bulan (1-12)
 * @returns JadwalSidangStatus - Status jadwal sidang
 */
export const getJadwalSidangStatus = async (
  minggudepan?: boolean,
  bulan?: number
): Promise<JadwalSidangStatus> => {
  try {
    let endpoint = `${BASE_ENDPOINT}/jadwal-sidang-status`;
    const params = new URLSearchParams();

    if (minggudepan) params.append("minggu_depan", "true");
    if (bulan) params.append("bulan", bulan.toString());

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch jadwal sidang status");

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching jadwal sidang status:", error);
    throw error;
  }
};

/**
 * Get all announcements
 * @param page - Nomor halaman (default: 1)
 * @param limit - Item per halaman (default: 10)
 * @param status - Filter status ("pending" | "published" | "draft")
 * @param search - Pencarian berdasarkan judul
 * @returns AnnouncementResponse - Daftar pengumuman
 */
export const getAnnouncements = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<AnnouncementResponse> => {
  try {
    let endpoint = `${ADMIN_ENDPOINT}/pengumuman?page=${page}&limit=${limit}`;

    if (status) endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch announcements");

    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

/**
 * Get recent announcements for dashboard
 * @param limit - Jumlah pengumuman (default: 2)
 * @returns AnnouncementResponse - Pengumuman terbaru
 */
export const getRecentAnnouncements = async (
  limit: number = 2
): Promise<AnnouncementResponse> => {
  try {
    const response = await api.get(
      `${BASE_ENDPOINT}/pengumuman-terbaru?limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch recent announcements");

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent announcements:", error);
    throw error;
  }
};

/**
 * Create new announcement
 * @param data - Announcement data
 * @returns AnnouncementResponse - Created announcement
 */
export const createAnnouncement = async (
  data: Partial<Announcement>
): Promise<AnnouncementResponse> => {
  try {
    const response = await api.post(`${ADMIN_ENDPOINT}/pengumuman`, data);
    if (!response.ok) throw new Error("Failed to create announcement");

    return await response.json();
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

/**
 * Update announcement
 * @param id - Announcement ID
 * @param data - Updated data
 * @returns AnnouncementResponse - Updated announcement
 */
export const updateAnnouncement = async (
  id: string,
  data: Partial<Announcement>
): Promise<AnnouncementResponse> => {
  try {
    const response = await api.put(`${ADMIN_ENDPOINT}/pengumuman/${id}`, data);
    if (!response.ok) throw new Error("Failed to update announcement");

    return await response.json();
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

/**
 * Delete announcement
 * @param id - Announcement ID
 * @returns AnnouncementResponse
 */
export const deleteAnnouncement = async (
  id: string
): Promise<AnnouncementResponse> => {
  try {
    const response = await api.delete(`${ADMIN_ENDPOINT}/pengumuman/${id}`);
    if (!response.ok) throw new Error("Failed to delete announcement");

    return await response.json();
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

/**
 * Get all users
 * @param page - Nomor halaman (default: 1)
 * @param limit - Item per halaman (default: 20)
 * @param role - Filter role ("mahasiswa" | "dosen" | "admin")
 * @param status - Filter status ("aktif" | "tidak_aktif" | "suspended")
 * @param search - Pencarian
 * @returns UsersResponse - Daftar users
 */
export const getUsers = async (
  page: number = 1,
  limit: number = 20,
  role?: string,
  status?: string,
  search?: string
): Promise<UsersResponse> => {
  try {
    let endpoint = `${ADMIN_ENDPOINT}/users?page=${page}&limit=${limit}`;

    if (role) endpoint += `&role=${role}`;
    if (status) endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch users");

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Get user detail
 * @param id - User ID
 * @returns UsersResponse - User detail
 */
export const getUserDetail = async (id: string): Promise<UsersResponse> => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINT}/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user detail");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  }
};

/**
 * Update user status
 * @param id - User ID
 * @param status - New status
 * @param alasan - Alasan perubahan (opsional)
 * @returns UsersResponse
 */
export const updateUserStatus = async (
  id: string,
  status: string,
  alasan?: string
): Promise<UsersResponse> => {
  try {
    const data: any = { status };
    if (alasan) data.alasan = alasan;

    const response = await api.put(
      `${ADMIN_ENDPOINT}/users/${id}/status`,
      data
    );
    if (!response.ok) throw new Error("Failed to update user status");

    return await response.json();
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

/**
 * Delete user
 * @param id - User ID
 * @returns UsersResponse
 */
export const deleteUser = async (id: string): Promise<UsersResponse> => {
  try {
    const response = await api.delete(`${ADMIN_ENDPOINT}/users/${id}`);
    if (!response.ok) throw new Error("Failed to delete user");

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Get all final projects
 * @param page - Nomor halaman (default: 1)
 * @param limit - Item per halaman (default: 20)
 * @param status - Filter status
 * @param search - Pencarian
 * @returns FinalProjectResponse - Daftar tugas akhir
 */
export const getFinalProjects = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string
): Promise<FinalProjectResponse> => {
  try {
    let endpoint = `${ADMIN_ENDPOINT}/tugas-akhir?page=${page}&limit=${limit}`;

    if (status) endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch final projects");

    return await response.json();
  } catch (error) {
    console.error("Error fetching final projects:", error);
    throw error;
  }
};

/**
 * Get final project detail
 * @param id - Final project ID
 * @returns FinalProjectResponse - Project detail
 */
export const getFinalProjectDetail = async (
  id: string
): Promise<FinalProjectResponse> => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINT}/tugas-akhir/${id}`);
    if (!response.ok) throw new Error("Failed to fetch final project detail");

    return await response.json();
  } catch (error) {
    console.error("Error fetching final project detail:", error);
    throw error;
  }
};

/**
 * Update final project status
 * @param id - Final project ID
 * @param status - New status
 * @param catatan - Catatan (opsional)
 * @returns FinalProjectResponse
 */
export const updateFinalProjectStatus = async (
  id: string,
  status: string,
  catatan?: string
): Promise<FinalProjectResponse> => {
  try {
    const data: any = { status };
    if (catatan) data.catatan = catatan;

    const response = await api.put(
      `${ADMIN_ENDPOINT}/tugas-akhir/${id}/status`,
      data
    );
    if (!response.ok) throw new Error("Failed to update final project status");

    return await response.json();
  } catch (error) {
    console.error("Error updating final project status:", error);
    throw error;
  }
};

/**
 * Get all examination schedules
 * @param page - Nomor halaman (default: 1)
 * @param limit - Item per halaman (default: 20)
 * @param status - Filter status
 * @param jenis - Filter jenis sidang
 * @param search - Pencarian
 * @returns ExaminationScheduleResponse - Daftar jadwal sidang
 */
export const getExaminationSchedules = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  jenis?: string,
  search?: string
): Promise<ExaminationScheduleResponse> => {
  try {
    let endpoint = `${ADMIN_ENDPOINT}/sidang?page=${page}&limit=${limit}`;

    if (status) endpoint += `&status=${status}`;
    if (jenis) endpoint += `&jenis=${jenis}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch examination schedules");

    return await response.json();
  } catch (error) {
    console.error("Error fetching examination schedules:", error);
    throw error;
  }
};

/**
 * Get examination schedule detail
 * @param id - Schedule ID
 * @returns ExaminationScheduleResponse - Schedule detail
 */
export const getExaminationScheduleDetail = async (
  id: string
): Promise<ExaminationScheduleResponse> => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINT}/sidang/${id}`);
    if (!response.ok)
      throw new Error("Failed to fetch examination schedule detail");

    return await response.json();
  } catch (error) {
    console.error("Error fetching examination schedule detail:", error);
    throw error;
  }
};

/**
 * Create examination schedule
 * @param data - Schedule data
 * @returns ExaminationScheduleResponse - Created schedule
 */
export const createExaminationSchedule = async (
  data: Partial<ExaminationSchedule>
): Promise<ExaminationScheduleResponse> => {
  try {
    const response = await api.post(`${ADMIN_ENDPOINT}/sidang`, data);
    if (!response.ok) throw new Error("Failed to create examination schedule");

    return await response.json();
  } catch (error) {
    console.error("Error creating examination schedule:", error);
    throw error;
  }
};

/**
 * Update examination schedule
 * @param id - Schedule ID
 * @param data - Updated data
 * @returns ExaminationScheduleResponse - Updated schedule
 */
export const updateExaminationSchedule = async (
  id: string,
  data: Partial<ExaminationSchedule>
): Promise<ExaminationScheduleResponse> => {
  try {
    const response = await api.put(`${ADMIN_ENDPOINT}/sidang/${id}`, data);
    if (!response.ok) throw new Error("Failed to update examination schedule");

    return await response.json();
  } catch (error) {
    console.error("Error updating examination schedule:", error);
    throw error;
  }
};

/**
 * Cancel examination schedule
 * @param id - Schedule ID
 * @param alasan_pembatalan - Alasan pembatalan
 * @returns ExaminationScheduleResponse
 */
export const cancelExaminationSchedule = async (
  id: string,
  alasan_pembatalan: string
): Promise<ExaminationScheduleResponse> => {
  try {
    const response = await api.put(`${ADMIN_ENDPOINT}/sidang/${id}/cancel`, {
      alasan_pembatalan,
    });
    if (!response.ok) throw new Error("Failed to cancel examination schedule");

    return await response.json();
  } catch (error) {
    console.error("Error cancelling examination schedule:", error);
    throw error;
  }
};

/**
 * Get all assessment rubrics
 * @param page - Nomor halaman (default: 1)
 * @param limit - Item per halaman (default: 20)
 * @param jenis_sidang - Filter jenis sidang
 * @param status - Filter status
 * @returns AssessmentRubricResponse - Daftar rubrik
 */
export const getAssessmentRubrics = async (
  page: number = 1,
  limit: number = 20,
  jenis_sidang?: string,
  status?: string
): Promise<AssessmentRubricResponse> => {
  try {
    let endpoint = `${ADMIN_ENDPOINT}/penilaian/rubrik?page=${page}&limit=${limit}`;

    if (jenis_sidang) endpoint += `&jenis_sidang=${jenis_sidang}`;
    if (status) endpoint += `&status=${status}`;

    const response = await api.get(endpoint);
    if (!response.ok) throw new Error("Failed to fetch assessment rubrics");

    return await response.json();
  } catch (error) {
    console.error("Error fetching assessment rubrics:", error);
    throw error;
  }
};

/**
 * Get assessment rubric detail
 * @param id - Rubric ID
 * @returns AssessmentRubricResponse - Rubric detail
 */
export const getAssessmentRubricDetail = async (
  id: string
): Promise<AssessmentRubricResponse> => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINT}/penilaian/rubrik/${id}`);
    if (!response.ok)
      throw new Error("Failed to fetch assessment rubric detail");

    return await response.json();
  } catch (error) {
    console.error("Error fetching assessment rubric detail:", error);
    throw error;
  }
};

/**
 * Create assessment rubric
 * @param data - Rubric data
 * @returns AssessmentRubricResponse - Created rubric
 */
export const createAssessmentRubric = async (
  data: Partial<AssessmentRubric>
): Promise<AssessmentRubricResponse> => {
  try {
    const response = await api.post(`${ADMIN_ENDPOINT}/penilaian/rubrik`, data);
    if (!response.ok) throw new Error("Failed to create assessment rubric");

    return await response.json();
  } catch (error) {
    console.error("Error creating assessment rubric:", error);
    throw error;
  }
};

/**
 * Update assessment rubric
 * @param id - Rubric ID
 * @param data - Updated data
 * @returns AssessmentRubricResponse - Updated rubric
 */
export const updateAssessmentRubric = async (
  id: string,
  data: Partial<AssessmentRubric>
): Promise<AssessmentRubricResponse> => {
  try {
    const response = await api.put(
      `${ADMIN_ENDPOINT}/penilaian/rubrik/${id}`,
      data
    );
    if (!response.ok) throw new Error("Failed to update assessment rubric");

    return await response.json();
  } catch (error) {
    console.error("Error updating assessment rubric:", error);
    throw error;
  }
};

/**
 * Delete assessment rubric
 * @param id - Rubric ID
 * @returns AssessmentRubricResponse
 */
export const deleteAssessmentRubric = async (
  id: string
): Promise<AssessmentRubricResponse> => {
  try {
    const response = await api.delete(
      `${ADMIN_ENDPOINT}/penilaian/rubrik/${id}`
    );
    if (!response.ok) throw new Error("Failed to delete assessment rubric");

    return await response.json();
  } catch (error) {
    console.error("Error deleting assessment rubric:", error);
    throw error;
  }
};

/**
 * Check system health
 * @returns SystemStatus - System health status
 */
export const checkSystemHealth = async (): Promise<any> => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINT}/health`);
    if (!response.ok) throw new Error("Failed to check system health");

    return await response.json();
  } catch (error) {
    console.error("Error checking system health:", error);
    throw error;
  }
};

export default {
  getAdminDashboardStats,
  getSystemStatus,
  getQuickStat,
  getPeriodeInfo,
  getDosenVerificationStatus,
  getJadwalSidangStatus,
  getAnnouncements,
  getRecentAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getUsers,
  getUserDetail,
  updateUserStatus,
  deleteUser,
  getFinalProjects,
  getFinalProjectDetail,
  updateFinalProjectStatus,
  getExaminationSchedules,
  getExaminationScheduleDetail,
  createExaminationSchedule,
  updateExaminationSchedule,
  cancelExaminationSchedule,
  getAssessmentRubrics,
  getAssessmentRubricDetail,
  createAssessmentRubric,
  updateAssessmentRubric,
  deleteAssessmentRubric,
  checkSystemHealth,
};
