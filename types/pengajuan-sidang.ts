export type StatusPengajuan = "menunggu" | "disetujui" | "ditolak";
export type JenisSidang = "proposal" | "hasil";

export interface DokumenPendukung {
  id: number;
  nama: string;
  url: string;
  uploadedAt: string;
}

export interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
  email?: string;
}

export interface PengajuanSidang {
  id: number;
  mahasiswa: Mahasiswa | Mahasiswa[]; // Reguler = 1, Capstone = 2-3
  tipeTA: "regular" | "capstone";
  jenisSidang: JenisSidang;
  judulTA: string;
  jumlahBimbingan: number;
  minimalBimbingan: number;
  status: StatusPengajuan;
  tanggalPengajuan: string;
  tanggalDiproses?: string;
  dokumenPendukung: DokumenPendukung[];
  catatan?: string;
  catatanPenolakan?: string;
  kelompokKeahlian?: { kk1?: string; kk2?: string };
  dosenPembimbing?: {
    id: number;
    nama: string;
  }[];
}

export interface PengajuanSidangApproval {
  id: number;
  status: "approved" | "rejected";
  rejection_notes?: string;
}
