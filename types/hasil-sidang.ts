/**
 * Hasil Sidang (BAP Results) Type Definitions
 * Defines all data structures for student final project examination results
 */

/**
 * Dosen Penguji Information with their assessment
 */
export interface DosenPenguji {
  no: number;
  id: string;
  nama: string;
  peran: "Pembimbing 1" | "Pembimbing 2" | "Penguji 1" | "Penguji 2";
  nilai: number; // Score given by this assessor
}

/**
 * Student Information for the examination
 */
export interface StudentInfo {
  id: string;
  nama: string;
  nim: string;
  tanggalSidang: string;
  judulTA?: string;
  programStudi?: string;
}

export interface KomentarDosen {
  kode: string;
  nama: string;
  role: any;
  komentar: string;
  tanggal: string;
}

/**
 * Overall Final Examination Results for Student
 */
export interface HasilSidang {
  id: string;
  studentId: string;
  studentInfo: StudentInfo;
  dosenList: DosenPenguji[];
  hasilAkhir: "LULUS" | "TIDAK LULUS" | "MENUNGGU"; // Overall result
  nilaiAkhir?: number; // Final score
  nilaiHuruf?: string; // Letter grade (A, B, C, D, E)
  komentar?: KomentarDosen[]; // Additional comments from examiners
  bapUrl?: string; // URL to download signed BAP document
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API Response wrapper for single HasilSidang
 */
export interface HasilSidangResponse {
  success: boolean;
  message: string;
  data?: HasilSidang;
  errors?: Array<{ field?: string; message: string }>;
}

/**
 * API Response wrapper for list of HasilSidang results
 */
export interface HasilSidangListResponse {
  success: boolean;
  message: string;
  data?: HasilSidang[];
  errors?: Array<{ field?: string; message: string }>;
}

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}
