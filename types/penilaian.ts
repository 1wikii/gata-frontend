// Types untuk Penilaian System

export type RubrikType = "SID" | "SEM";
export type JenisSidang = "PROPOSAL" | "SIDANG";
export type StatusPenilaian = "belum_dinilai" | "sudah_dinilai" | "terkunci";
export type RoleDosen = "pembimbing1" | "pembimbing2" | "penguji1" | "penguji2";

// Rubrik Types
export interface OpsiJawaban {
  id: string;
  pertanyaanId: string;
  text: string;
  nilai: number;
  urutan: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pertanyaan {
  id: string;
  groupId: string;
  text: string;
  bobot: number;
  urutan: number;
  opsiJawaban: OpsiJawaban[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RubrikGroup {
  id: string;
  rubrikId: string;
  nama: string;
  bobotTotal: number;
  urutan: number;
  pertanyaans: Pertanyaan[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Rubrik {
  id: string;
  nama: string;
  deskripsi?: string;
  type: RubrikType;
  isDefault: boolean;
  isActive: boolean;
  groups: RubrikGroup[];
  createdAt?: string;
  updatedAt?: string;
}

// Request Types
export interface CreateRubrikRequest {
  nama: string;
  deskripsi?: string;
  type: RubrikType;
}

export interface UpdateRubrikRequest {
  nama?: string;
  deskripsi?: string;
  type?: RubrikType;
}

export interface CreateGroupRequest {
  nama: string;
  bobotTotal: number;
  urutan: number;
}

export interface UpdateGroupRequest {
  nama?: string;
  bobotTotal?: number;
  urutan?: number;
}

export interface ReorderRequest {
  items: Array<{
    id: string;
    urutan: number;
  }>;
}

export interface CreatePertanyaanRequest {
  text: string;
  bobot: number;
  urutan: number;
}

export interface UpdatePertanyaanRequest {
  text?: string;
  bobot?: number;
  urutan?: number;
  groupId?: string;
}

export interface CreateOpsiRequest {
  text: string;
  nilai: number;
  urutan: number;
}

export interface UpdateOpsiRequest {
  text?: string;
  nilai?: number;
  urutan?: number;
}

export interface BulkDeleteOpsiRequest {
  opsiIds: string[];
}

// Rentang Nilai Types
export interface RentangNilai {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  urutan: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRentangNilaiRequest {
  grade: string;
  minScore: number;
  urutan: number;
}

export interface UpdateRentangNilaiRequest {
  grade?: string;
  minScore?: number;
  urutan?: number;
}

export interface BulkUpdateRentangNilaiRequest {
  rentangNilai: Array<{
    id: string;
    grade: string;
    minScore: number;
    urutan: number;
  }>;
}

// Jadwal Types
export interface JadwalSidang {
  id: string;
  mahasiswaId: string;
  mahasiswa: {
    id: string;
    nim: string;
    name: string;
  };
  jenisSidang: JenisSidang;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  judul: string;
  lokasi: string;
  capstone?: string;
  pembimbing1?: {
    id: string;
    kode: string;
    name: string;
  };
  pembimbing2?: {
    id: string;
    kode: string;
    name: string;
  };
  penguji1?: {
    id: string;
    kode: string;
    nama: string;
  };
  penguji2?: {
    id: string;
    kode: string;
    nama: string;
  };
  rubrikId: string;
  rubrik?: Rubrik;
  laporanTA?: string;
  slidePresentasi?: string;
  statusPenilaian: StatusPenilaian;
  isFinalized: boolean;
  finalizedBy?: string;
  finalizedAt?: string;
  roleDosen?: RoleDosen;
  sudahDinilaiOlehDosen?: boolean;
  statusKehadiran?: "HARI INI" | "LEWAT" | "MENDATANG";
  createdAt?: string;
  updatedAt?: string;
}

// Penilaian Types
export interface JawabanPenilaian {
  pertanyaanId: string;
  pertanyaanText?: string;
  opsiJawabanId: string;
  opsiJawabanText?: string;
  nilai: number;
  bobot?: number;
}

export interface Penilaian {
  id: string;
  jadwalId: string;
  lecturerId: string;
  lecturer?: {
    id: string;
    kode: string;
    nama: string;
  };
  roleDosen: RoleDosen;
  nilaiAkhir: number;
  nilaiHuruf: string;
  catatan?: string;
  jawaban: JawabanPenilaian[];
  breakdown?: {
    groups: Array<{
      groupNama: string;
      bobotGroup: number;
      nilaiGroup: number;
      pertanyaans: Array<{
        text: string;
        bobot: number;
        nilai: number;
        poin: number;
      }>;
    }>;
    totalPoin: number;
    totalBobotMaksimal: number;
    nilaiAkhir: number;
  };
  isFinalized: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitPenilaianRequest {
  jawaban: Array<{
    pertanyaanId: string;
    opsiJawabanId: string;
    nilai: number;
  }>;
  catatan?: string;
}

// Rekap Types
export interface RekapNilai {
  jadwalId: string;
  mahasiswa: {
    nim: string;
    nama: string;
  };
  jenisSidang: JenisSidang;
  penilaianDosen: Array<{
    dosenKode: string;
    dosenNama: string;
    role: RoleDosen;
    nilai: number;
    nilaiHuruf: string;
    tanggal: string;
  }>;
  rekap: {
    rata2Pembimbing: number;
    rata2Penguji: number;
    nilaiAkhir: number;
    nilaiHuruf: string;
  };
  isFinalized: boolean;
  finalizedBy?: {
    dosenKode: string;
    dosenNama: string;
    role: RoleDosen;
  };
  finalizedAt?: string;
}

// Komentar Types
export interface Komentar {
  dosenKode: string;
  dosenNama: string;
  role: RoleDosen;
  catatan: string;
  createdAt: string;
}

// BAP Types
export interface BAP {
  id: string;
  jadwalId: string;
  fileName: string;
  fileUrl: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  nilaiAkhir: number;
  nilaiHuruf: string;
  generatedBy?: string;
  generatedAt: string;
  version: number;
  isLatest: boolean;
  createdAt?: string;
}

export interface BAPPreview {
  jadwalId: string;
  mahasiswa: {
    nim: string;
    nama: string;
  };
  jenisSidang: JenisSidang;
  tanggal: string;
  judul: string;
  pembimbing: Array<{
    nama: string;
    nip: string;
    nilai: number;
  }>;
  penguji: Array<{
    nama: string;
    nip: string;
    nilai: number;
  }>;
  nilaiAkhir: number;
  nilaiHuruf: string;
  komentar: Array<{
    dosen: string;
    catatan: string;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// View Dosen Admin Types
export interface ViewDosenItem {
  id: string;
  mahasiswa: {
    nim: string;
    nama: string;
  };
  jenisSidang: JenisSidang;
  tanggal: string;
  statusPenilaian: StatusPenilaian;
  rekap?: {
    nilaiAkhir: number;
    nilaiHuruf: string;
    finalizedBy?: string;
  };
  jumlahDosenSudahNilai: number;
  totalDosen: number;
}
