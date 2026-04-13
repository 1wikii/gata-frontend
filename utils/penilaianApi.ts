import { api } from "./api";
import type {
  Rubrik,
  CreateRubrikRequest,
  UpdateRubrikRequest,
  CreateGroupRequest,
  UpdateGroupRequest,
  ReorderRequest,
  CreatePertanyaanRequest,
  UpdatePertanyaanRequest,
  CreateOpsiRequest,
  UpdateOpsiRequest,
  BulkDeleteOpsiRequest,
  RentangNilai,
  CreateRentangNilaiRequest,
  UpdateRentangNilaiRequest,
  BulkUpdateRentangNilaiRequest,
  JadwalSidang,
  Penilaian,
  SubmitPenilaianRequest,
  RekapNilai,
  Komentar,
  BAP,
  BAPPreview,
  ViewDosenItem,
  ApiResponse,
  PaginatedResponse,
} from "@/types/penilaian";

// ============================================
// ADMIN - RUBRIK MANAGEMENT
// ============================================

export const rubrikApi = {
  // Get all rubriks
  getAll: async (params?: {
    type?: "SID" | "SEM";
    showArchived?: boolean;
  }): Promise<ApiResponse<Rubrik[]>> => {
    let endpoint = `/admin/penilaian/rubrik`;
    const queryParams = new URLSearchParams();

    if (params?.type) queryParams.append("type", params.type);
    // Only add showArchived if it's explicitly true
    if (params?.showArchived === true)
      queryParams.append("showArchived", String(params.showArchived));

    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    const response = await api.get(endpoint);
    return response.json();
  },

  // Get rubrik by ID
  getById: async (id: string): Promise<ApiResponse<Rubrik>> => {
    const response = await api.get(`/admin/penilaian/rubrik/${id}`);
    return response.json();
  },

  // Create rubrik
  create: async (data: CreateRubrikRequest): Promise<ApiResponse<Rubrik>> => {
    const response = await api.post("/admin/penilaian/rubrik", data);
    return response.json();
  },

  // Update rubrik
  update: async (
    id: string,
    data: UpdateRubrikRequest
  ): Promise<ApiResponse<Rubrik>> => {
    const response = await api.put(`/admin/penilaian/rubrik/${id}`, data);
    return response.json();
  },

  // Delete rubrik
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/penilaian/rubrik/${id}`);
    return response.json();
  },

  // Duplicate rubrik
  duplicate: async (id: string): Promise<ApiResponse<Rubrik>> => {
    const response = await api.post(
      `/admin/penilaian/rubrik/${id}/duplicate`,
      {}
    );
    return response.json();
  },

  // Set default rubrik
  setDefault: async (
    id: string,
    type: "SEM" | "SID"
  ): Promise<ApiResponse<Rubrik>> => {
    const response = await api.post(
      `/admin/penilaian/rubrik/${id}/set-default`,
      { type }
    );
    return response.json();
  },
};

// ============================================
// ADMIN - GROUP MANAGEMENT
// ============================================

export const groupApi = {
  // Create group
  create: async (
    rubrikId: string,
    data: CreateGroupRequest
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(
      `/admin/penilaian/rubrik/${rubrikId}/group`,
      data
    );
    return response.json();
  },

  // Update group
  update: async (
    id: string,
    data: UpdateGroupRequest
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/penilaian/group/${id}`, data);
    return response.json();
  },

  // Delete group
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/penilaian/group/${id}`);
    return response.json();
  },

  // Reorder groups
  reorder: async (
    rubrikId: string,
    data: ReorderRequest
  ): Promise<ApiResponse<void>> => {
    const response = await api.put(
      `/admin/penilaian/rubrik/${rubrikId}/group/reorder`,
      data
    );
    return response.json();
  },
};

// ============================================
// ADMIN - PERTANYAAN MANAGEMENT
// ============================================

export const pertanyaanApi = {
  // Create pertanyaan
  create: async (
    groupId: string,
    data: CreatePertanyaanRequest
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(
      `/admin/penilaian/group/${groupId}/pertanyaan`,
      data
    );
    return response.json();
  },

  // Update pertanyaan
  update: async (id: string, data: UpdatePertanyaanRequest): Promise<any> => {
    const response = await api.post(`/admin/penilaian/pertanyaan/${id}`, data);
    return response;
  },

  // Delete pertanyaan
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/penilaian/pertanyaan/${id}`);
    return response.json();
  },

  // Duplicate pertanyaan
  duplicate: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(
      `/admin/penilaian/pertanyaan/${id}/duplicate`,
      {}
    );
    return response.json();
  },

  // Reorder pertanyaans
  reorder: async (
    groupId: string,
    data: ReorderRequest
  ): Promise<ApiResponse<void>> => {
    const response = await api.put(
      `/admin/penilaian/group/${groupId}/pertanyaan/reorder`,
      data
    );
    return response.json();
  },
};

// ============================================
// ADMIN - OPSI JAWABAN MANAGEMENT
// ============================================

export const opsiJawabanApi = {
  // Create opsi
  create: async (
    pertanyaanId: string,
    data: CreateOpsiRequest
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(
      `/admin/penilaian/pertanyaan/${pertanyaanId}/opsi`,
      data
    );
    return response.json();
  },

  // Update opsi
  update: async (
    id: string,
    data: UpdateOpsiRequest
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/penilaian/opsi/${id}`, data);
    return response.json();
  },

  // Delete opsi
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/penilaian/opsi/${id}`);
    return response.json();
  },

  // Bulk delete opsi
  bulkDelete: async (
    pertanyaanId: string,
    data: BulkDeleteOpsiRequest
  ): Promise<ApiResponse<void>> => {
    const response = await api.delete(
      `/admin/penilaian/pertanyaan/${pertanyaanId}/opsi/bulk`,
      data
    );
    return response.json();
  },
};

// ============================================
// ADMIN - RENTANG NILAI MANAGEMENT
// ============================================

export const rentangNilaiApi = {
  // Get all rentang nilai
  getAll: async (): Promise<ApiResponse<RentangNilai[]>> => {
    const response = await api.get("/admin/penilaian/rentang-nilai");
    return response.json();
  },

  // Create rentang nilai
  create: async (
    data: CreateRentangNilaiRequest
  ): Promise<ApiResponse<RentangNilai>> => {
    const response = await api.post("/admin/penilaian/rentang-nilai", data);
    return response.json();
  },

  // Update rentang nilai
  update: async (
    id: string,
    data: UpdateRentangNilaiRequest
  ): Promise<ApiResponse<RentangNilai>> => {
    const response = await api.post(
      `/admin/penilaian/rentang-nilai/${id}`,
      data
    );
    return response.json();
  },

  // Delete rentang nilai
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/penilaian/rentang-nilai/${id}`);
    return response.json();
  },

  // Bulk update rentang nilai
  bulkUpdate: async (data: BulkUpdateRentangNilaiRequest): Promise<any> => {
    const response = await api.put("/admin/penilaian/rentang-nilai/bulk", data);
    return response;
  },
};

// ============================================
// ADMIN - VIEW DOSEN & BAP
// ============================================

export const viewDosenApi = {
  // Get all penilaian (admin view)
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    search?: string;
    jenisSidang?: "PROPOSAL" | "SIDANG";
    statusPenilaian?: "belum_dinilai" | "sudah_dinilai" | "terkunci";
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ViewDosenItem>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.jenisSidang)
      queryParams.append("jenisSidang", params.jenisSidang);
    if (params?.statusPenilaian)
      queryParams.append("statusPenilaian", params.statusPenilaian);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    const response = await api.get(
      `/admin/penilaian/view-dosen?${queryParams.toString()}`
    );
    return response.json();
  },
};

// ============================================
// ADMIN - BAP MANAGEMENT
// ============================================

export const bapApi = {
  // Generate BAP
  generate: async (jadwalId: string): Promise<ApiResponse<BAP>> => {
    const response = await api.post(
      `/admin/penilaian/jadwal/${jadwalId}/generate-bap`,
      {}
    );
    return response.json();
  },

  // Download BAP
  download: async (jadwalId: string): Promise<void> => {
    const response = await api.get(`/admin/penilaian/jadwal/${jadwalId}/bap`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BAP_${jadwalId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  // Preview BAP
  preview: async (jadwalId: string): Promise<ApiResponse<BAPPreview>> => {
    const response = await api.get(
      `/admin/penilaian/jadwal/${jadwalId}/bap/preview`
    );
    return response.json();
  },
};

// ============================================
// DOSEN - JADWAL MANAGEMENT
// ============================================

export const jadwalApi = {
  // Get dosen's jadwal
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    search?: string;
    jenisSidang?: "PROPOSAL" | "SIDANG";
  }): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.jenisSidang)
      queryParams.append("jenisSidang", params.jenisSidang);

    const response = await api.get(
      `/dosen/penilaian/jadwal?${queryParams.toString()}`
    );
    return response;
  },

  // Get jadwal detail
  getById: async (jadwalId: string): Promise<ApiResponse<JadwalSidang>> => {
    const response = await api.get(`/dosen/penilaian/jadwal/${jadwalId}`);
    return response.json();
  },
};

// ============================================
// DOSEN - PENILAIAN MANAGEMENT
// ============================================

export const penilaianApi = {
  // Submit/update penilaian
  submit: async (
    jadwalId: string,
    data: SubmitPenilaianRequest
  ): Promise<ApiResponse<Penilaian>> => {
    const response = await api.post(
      `/dosen/penilaian/jadwal/${jadwalId}/nilai`,
      data
    );
    return response.json();
  },

  // Get own penilaian
  getOwn: async (jadwalId: string): Promise<ApiResponse<Penilaian>> => {
    const response = await api.get(`/dosen/penilaian/jadwal/${jadwalId}/nilai`);
    return response.json();
  },

  // Get rekap nilai
  getRekap: async (jadwalId: string): Promise<ApiResponse<RekapNilai>> => {
    const response = await api.get(`/dosen/penilaian/jadwal/${jadwalId}/rekap`);
    return response.json();
  },

  // Get komentar
  getKomentar: async (jadwalId: string): Promise<ApiResponse<Komentar[]>> => {
    const response = await api.get(
      `/dosen/penilaian/jadwal/${jadwalId}/komentar`
    );
    return response.json();
  },

  // Finalisasi nilai (Pembimbing 1 only)
  finalisasi: async (jadwalId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(
      `/dosen/penilaian/jadwal/${jadwalId}/finalisasi`,
      { confirm: true }
    );
    return response.json();
  },
};

// Export all APIs
export const penilaianApiClient = {
  rubrik: rubrikApi,
  group: groupApi,
  pertanyaan: pertanyaanApi,
  opsiJawaban: opsiJawabanApi,
  rentangNilai: rentangNilaiApi,
  viewDosen: viewDosenApi,
  bap: bapApi,
  jadwal: jadwalApi,
  penilaian: penilaianApi,
};
