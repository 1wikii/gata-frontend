import {
  Home,
  FileText,
  Users,
  Calendar,
  Star,
  Settings,
  Bell,
} from "lucide-react";

export const NAV_TITLE = {
  admin: {},
  dosen: {},
  mahasiswa: {
    "tugas-akhir": "Pendaftaran Tugas Akhir",
    sidang: "Pendaftaran Sidang",
    bap: "Penilaian Sidang",
    bimbingan: "Monitoring Bimbingan",
  },
};

export const NAV_SUBTITLE = {
  admin: {},
  dosen: {},
  mahasiswa: {
    "tugas-akhir": "Waktunya jadi sarjana!",
    sidang: "Waktunya sidang!",
    bap: "Akhirnya bisa lihat hasilmu!",
    bimbingan: "Waktunya Bimbingan!",
  },
};

export const SIDEBAR_MENU = {
  student: [
    { icon: Home, label: "Dashboard", path: "/mahasiswa" },
    {
      icon: FileText,
      label: "Pendaftaran TA",
      path: null,
      hasSubmenu: true,
      submenu: [
        { label: "Daftar", path: "/mahasiswa/tugas-akhir/daftar" },
        { label: "Riwayat", path: "/mahasiswa/tugas-akhir/riwayat" },
      ],
    },
    {
      icon: Users,
      label: "Bimbingan",
      path: null,
      hasSubmenu: true,
      submenu: [
        { label: "Dashboard", path: "/mahasiswa/bimbingan" },
        { label: "Pengajuan", path: "/mahasiswa/bimbingan/pengajuan" },
        {
          label: "Pengajuan Sidang",
          path: "/mahasiswa/bimbingan/pengajuan-sidang",
        },
      ],
    },
    {
      icon: Star,
      label: "Hasil Sidang",
      path: "/mahasiswa/hasil-sidang",
    },
  ],
  lecturer: [
    { icon: Home, label: "Dashboard", path: "/dosen" },
    {
      icon: FileText,
      label: "Tugas Akhir",
      path: null,
      hasSubmenu: true,
      submenu: [{ label: "Validasi", path: "/dosen/validasi" }],
    },
    {
      icon: Calendar,
      label: "Bimbingan",
      path: null,
      hasSubmenu: true,
      submenu: [
        { label: "Dashboard", path: "/dosen/bimbingan" },
        { label: "Jadwal", path: "/dosen/bimbingan/jadwal" },
        { label: "Total Mahasiswa", path: "/dosen/bimbingan/total-mahasiswa" },
        {
          label: "Pengajuan Sidang",
          path: "/dosen/bimbingan/pengajuan-sidang",
        },
      ],
    },
    {
      icon: Star,
      label: "Penilaian",
      path: null,
      hasSubmenu: true,
      submenu: [{ label: "Penilaian", path: "/dosen/penilaian" }],
    },
  ],
  admin: [
    { section: "DOSEN" },
    { icon: Home, label: "Dashboard", path: "/dosen" },
    {
      icon: FileText,
      label: "Tugas Akhir",
      path: null,
      hasSubmenu: true,
      submenu: [{ label: "Validasi", path: "/dosen/validasi" }],
    },
    {
      icon: Calendar,
      label: "Bimbingan",
      path: null,
      hasSubmenu: true,
      submenu: [
        { label: "Dashboard", path: "/dosen/bimbingan" },
        { label: "Jadwal", path: "/dosen/bimbingan/jadwal" },
        { label: "Total Mahasiswa", path: "/dosen/bimbingan/total-mahasiswa" },
        {
          label: "Pengajuan Sidang",
          path: "/dosen/bimbingan/pengajuan-sidang",
        },
      ],
    },
    {
      icon: Star,
      label: "Penilaian",
      path: null,
      hasSubmenu: true,
      submenu: [{ label: "Penilaian", path: "/dosen/penilaian" }],
    },

    { section: "ADMIN" },
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Bell, label: "Kelola Pengumuman", path: "/admin/pengumuman" },
    { icon: Users, label: "Kelola Users", path: "/admin/users" },
    {
      icon: FileText,
      label: "Kelola Tugas Akhir",
      path: null,
      hasSubmenu: true,
      submenu: [
        { label: "Dashboard", path: "/admin/tugas-akhir" },
        { label: "Periode", path: "/admin/tugas-akhir/periode" },
        { label: "Dosen", path: "/admin/tugas-akhir/dosen" },
        { label: "Pengajuan", path: "/admin/tugas-akhir/pengajuan" },
      ],
    },
    {
      icon: Calendar,
      label: "Kelola Sidang",
      path: null,
      hasSubmenu: true,
      submenu: [
        { label: "Dashboard", path: "/admin/sidang" },
        { label: "Belum Terjadwal", path: "/admin/sidang/belum-terjadwal" },
        { label: "Penjadwalan", path: "/admin/sidang/penjadwalan" },
      ],
    },

    {
      icon: Star,
      label: "Kelola Penilaian",
      path: null,
      hasSubmenu: true,
      submenu: [{ label: "Rubrik", path: "/admin/penilaian/rubrik" }],
    },
    // { icon: Settings, label: "Pengaturan Sistem", path: "/settings" },
  ],
};
