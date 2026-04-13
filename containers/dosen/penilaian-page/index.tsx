"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, X, AlertCircle } from "lucide-react";
import type { MouseEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import {
  validateSimpanNilai,
  getTotalPertanyaanFromRubrik,
  formatErrorMessage,
  hasExistingValues,
  convertNilaiToNumber,
  calculateRealtimeNilai,
  type SimpanNilaiRequest,
  type SimpanNilaiResponse,
  type ValidationError,
  type GradeRange,
} from "@/utils/penilaianHelper";

interface OpsiJawaban {
  id: string;
  text: string;
  nilai: number;
  urutan: number;
}

interface Pertanyaan {
  id: string;
  groupId: string;
  text: string;
  bobot: number;
  urutan: number;
  opsiJawabans: OpsiJawaban[];
  selectedNilai?: number;
}

interface PertanyaanGroup {
  id: string;
  nama: string;
  bobotTotal: number;
  urutan: number;
  rubrikId?: string;
  pertanyaans: Pertanyaan[];
}

interface DosenNilai {
  kode: string;
  nama: string;
  nilai: number;
  tanggal: string;
}

interface Jadwal {
  jadwalId: number;
  penilaianId?: string; // ID penilaian untuk keperluan update
  studentId: number;
  nama: string;
  nim: string;
  jenisSidang: "PROPOSAL" | "SIDANG";
  statusKehadiran: "HARI INI" | "LEWAT" | "MENDATANG";
  tanggal: string;
  waktu: string;
  judul: string;
  lokasi: string;
  tipeTA: "Capstone" | "Reguler";
  capstone?: string;
  isSupervisor1: boolean;
  isCanFinalize: boolean;
  pembimbing1: string;
  pembimbing2: string;
  penguji1: string;
  penguji2: string;
  laporanTA: string;
  slidePresentasi: string;
  statusPenilaian: "belum_dinilai" | "sudah_dinilai" | "terkunci";
  nilaiPertanyaan?: {
    [pertanyaanId: string]: number;
  };
  catatanMahasiswa?: string;
  rekap?: {
    rata2Pembimbing: number;
    rata2Penguji: number;
    nilaiAkhir: number;
    nilaiHuruf: string;
    isFinalized: boolean;
    finalisasiOleh: string;
    detailPerDosen: DosenNilai[];
  };
  catatan?: string;
  nilaiAkhirDosenIni?: number;
  nilaiHurufDosenIni?: string;
  komentar?: {
    kode: string;
    nama: string;
    komentar: string;
    tanggal: string;
  }[];
  rubrik: {
    id: string;
    nama: string;
    deskripsi: string;
    type: "SEM" | "SID";
    isDefault: boolean;
    groups: PertanyaanGroup[];
  };
  rentangNilai: {
    id: string;
    urutan: number;
    grade: string;
    minScore: number;
  }[];
  BAPUrl: {
    pdfName: string | null;
    pdfUrl: string | null;
  };
}

const PenilaianPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 20);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 20);
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, "0");
    const day = String(endDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [showPenilaianModal, setShowPenilaianModal] = useState(false);
  const [showRekapModal, setShowRekapModal] = useState(false);
  const [showKomentarModal, setShowKomentarModal] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);
  const [activeKomentarKode, setActiveKomentarKode] = useState<string | null>(
    null
  );
  const [expandedJadwalIds, setExpandedJadwalIds] = useState<number[]>([]);
  const [nilaiPertanyaan, setNilaiPertanyaan] = useState<{
    [key: string]: number;
  }>({});
  const [catatanModal, setCatatanModal] = useState("");
  const [nilaiAkhirDosenIni, setNilaiAkhirDosenIni] = useState<number | null>(
    null
  );
  const [nilaiHurufDosenIni, setNilaiHurufDosenIni] = useState<string | null>(
    null
  );
  const [calculatedNilaiAkhir, setCalculatedNilaiAkhir] = useState<number>(0);
  const [calculatedNilaiHuruf, setCalculatedNilaiHuruf] = useState<string>("E");
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isGeneratingBAP, setIsGeneratingBAP] = useState(false);
  const [showSignatureWarningModal, setShowSignatureWarningModal] =
    useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchJadwalPenilaian();
  }, [user?.id]);

  const fetchJadwalPenilaian = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/dosen/penilaian/data-sidang/${user.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      setJadwalList(data.data || []);
    } catch (err) {
      console.error("Error fetching jadwal penilaian:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      setJadwalList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate nilai realtime when nilaiPertanyaan changes
  useEffect(() => {
    if (
      selectedJadwal &&
      selectedJadwal.rubrik?.groups &&
      selectedJadwal.rentangNilai
    ) {
      const gradeRanges: GradeRange[] = selectedJadwal.rentangNilai.map(
        (r) => ({
          grade: r.grade,
          minScore: r.minScore,
        })
      );

      const result = calculateRealtimeNilai(
        selectedJadwal.rubrik.groups,
        nilaiPertanyaan,
        gradeRanges
      );

      setCalculatedNilaiAkhir(result.percent);
      setCalculatedNilaiHuruf(result.letter);
    }
  }, [nilaiPertanyaan, selectedJadwal]);

  // Handle refresh button
  const handleRefresh = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/dosen/penilaian/data-sidang/${user.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      setJadwalList(data.data || []);
    } catch (err) {
      console.error("Error refreshing jadwal penilaian:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset date filter
  const handleResetDateFilter = () => {
    const defaultRange = getDefaultDateRange();
    setStartDate(defaultRange.startDate);
    setEndDate(defaultRange.endDate);
  };

  const handleOpenPenilaian = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    // Initialize form values from jadwal if they exist
    if (jadwal.nilaiPertanyaan) {
      // ubah nilaiPertanyaan ke number
      const convertedNilai = convertNilaiToNumber(jadwal.nilaiPertanyaan);

      setNilaiPertanyaan(convertedNilai);
    } else {
      setNilaiPertanyaan({});
    }
    setCatatanModal(jadwal.catatan || "");
    setNilaiAkhirDosenIni(jadwal.nilaiAkhirDosenIni || null);
    setNilaiHurufDosenIni(jadwal.nilaiHurufDosenIni || null);
    setShowPenilaianModal(true);
  };

  const handleOpenRekap = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setShowRekapModal(true);
  };

  const handleOpenKomentar = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setShowKomentarModal(true);
  };

  const handleSimpanNilai = async () => {
    // Reset validation errors
    setValidationErrors([]);

    // Get total pertanyaan dari rubrik
    const totalPertanyaan = selectedJadwal?.rubrik?.groups
      ? getTotalPertanyaanFromRubrik(selectedJadwal.rubrik.groups)
      : 0;

    // Validasi input
    const errors = validateSimpanNilai(
      nilaiPertanyaan,
      catatanModal,
      totalPertanyaan
    );

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Jika validasi passed, panggil API
    try {
      setIsSaving(true);

      // Detect apakah ini create atau update
      const isUpdate = hasExistingValues(selectedJadwal?.nilaiPertanyaan);
      const endpoint = isUpdate
        ? "/dosen/penilaian/update-nilai"
        : "/dosen/penilaian/simpan-nilai";

      const request: SimpanNilaiRequest = {
        jadwalId: selectedJadwal?.jadwalId || 0,
        userId: parseInt(user?.id || "0", 10),
        studentId: selectedJadwal?.studentId || 0,
        nilaiPertanyaan: convertNilaiToNumber(nilaiPertanyaan),
        nilaiAkhir: calculatedNilaiAkhir,
        nilaiHuruf: calculatedNilaiHuruf,
        catatan: catatanModal,
        ...(isUpdate &&
          selectedJadwal?.penilaianId && {
            penilaianId: selectedJadwal.penilaianId,
          }),
      };

      const response = await api.post(endpoint, request);

      if (!response.ok) {
        const errorData = await response.json();
        setValidationErrors(errorData.errors || []);
        alert(errorData.message || "Gagal menyimpan nilai, silakan coba lagi");
        return;
      }

      const data: SimpanNilaiResponse = await response.json();

      if (data.success) {
        const statusMessage = isUpdate ? "diperbarui" : "disimpan";
        alert(
          `✓ Nilai berhasil ${statusMessage}!\n\nNilai Akhir: ${data.data?.nilaiAkhir}\nNilai Huruf: ${data.data?.nilaiHuruf}`
        );

        // Refresh data dan tutup modal
        setShowPenilaianModal(false);
        setValidationErrors([]);
        setNilaiPertanyaan({});
        setCatatanModal("");

        // Refresh jadwal list
        await handleRefresh();
      } else {
        setValidationErrors(data.errors || []);
        alert(data.message || "Gagal menyimpan nilai");
      }
    } catch (err) {
      console.error("Error saat menyimpan nilai:", err);
      alert(
        err instanceof Error ? err.message : "Terjadi kesalahan pada server"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBAP = (jadwal: Jadwal) => {
    alert(`Generating BAP for ${jadwal.nama}...`);
  };

  const handleFinalisasi = async (jadwal: Jadwal) => {
    if (!window.confirm("Apakah Anda yakin ingin menginalisasi nilai?")) {
      return;
    }

    try {
      setIsFinalizing(true);

      const request = {
        jadwalId: jadwal.jadwalId,
        studentId: jadwal.studentId,
        finalizedBy: jadwal.pembimbing1,
      };

      const response = await api.post(
        `/dosen/penilaian/jadwal/${jadwal.jadwalId}/finalisasi`,
        request
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Gagal menginalisasi nilai");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Refresh jadwal list
        await handleRefresh();

        // Reload halaman untuk memperbarui status finalisasi
        window.location.reload();
      } else {
        alert(data.message || "Gagal menginalisasi nilai");
      }
    } catch (err) {
      console.error("Error saat menginalisasi nilai:", err);
      alert(
        err instanceof Error ? err.message : "Terjadi kesalahan pada server"
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleGenerateBAP = async (jadwal: Jadwal) => {
    try {
      setIsGeneratingBAP(true);

      const response = await api.post(
        `/dosen/penilaian/jadwal/${jadwal.jadwalId}/student/${jadwal.studentId}/generate-bap-pdf`,
        {}
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Check if error is about missing signature
        if (errorData.errors?.path === "ttd") {
          setShowSignatureWarningModal(true);
          return;
        }

        alert(errorData.message || "Gagal membuat BAP PDF");
        return;
      }

      const data = await response.json();

      if (data.data?.pdfUrl) {
        alert("✓ BAP berhasil di-generate!");

        // Tambahkan prefix server base URL ke pdfUrl
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";
        const fullPdfUrl = baseUrl + data.data.pdfUrl;

        // Buka PDF di tab baru
        window.open(fullPdfUrl, "_blank");

        // Refresh jadwal list
        await handleRefresh();
      } else {
        alert(data.message || "Gagal membuat BAP PDF");
      }
    } catch (err) {
      console.error("Error saat generate BAP:", err);
      alert(
        err instanceof Error ? err.message : "Terjadi kesalahan pada server"
      );
    } finally {
      setIsGeneratingBAP(false);
    }
  };

  // formater datetime menjadi contoh : Senin, 12 Oktober 2025
  function formatDateTimeIndo(dateString: string): string {
    const date = new Date(dateString);

    const hari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const namaHari = hari[date.getDay()];
    const tanggal = date.getDate();
    const namaBulan = bulan[date.getMonth()];
    const tahun = date.getFullYear();

    const jam = date.getHours().toString().padStart(2, "0");
    const menit = date.getMinutes().toString().padStart(2, "0");

    return `${namaHari}, ${tanggal} ${namaBulan} ${tahun} ${jam}:${menit}`;
  }

  // Function to calculate H-20 and H+20 dates
  const getDefaultDateRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 20);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 20);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  // Jika jadwalId match dengan expandedJadwalIds, expand jadwal tersebut
  const isJadwalExpanded = (jadwal: Jadwal) => {
    return expandedJadwalIds.includes(jadwal.jadwalId);
  };

  // Function untuk menambahkan base URL prefix ke pdfUrl
  const getPdfUrl = (pdfUrl: string | null): string | null => {
    if (!pdfUrl) return null;
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";
    return baseUrl + pdfUrl;
  };

  // Filter jadwal by search query and date range
  const filteredJadwal = jadwalList.filter((j) => {
    // Search query filter
    const matchesSearch =
      j.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.nim.includes(searchQuery) ||
      j.judul.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filter (YYYY-MM-DD format comparison)
    let matchesDateRange = true;
    if (startDate && endDate && j.tanggal) {
      // Extract date part only (YYYY-MM-DD) for proper comparison
      const jadwalDateOnly = j.tanggal.split("T")[0];
      matchesDateRange =
        jadwalDateOnly >= startDate && jadwalDateOnly <= endDate;
    }

    return matchesSearch && matchesDateRange;
  });

  const stats = {
    lewat: filteredJadwal.filter((j) => j.statusKehadiran === "LEWAT").length,
    hariIni: filteredJadwal.filter((j) => j.statusKehadiran === "HARI INI")
      .length,
    mendatang: filteredJadwal.filter((j) => j.statusKehadiran === "MENDATANG")
      .length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Penilaian Sidang</h1>
          <p className="text-indigo-100">
            Kelola jadwal seminar dan sidang mahasiswa bimbingan Anda
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Jadwal Saya</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama mahasiswa atau judul TA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Memuat..." : "Refresh"}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Filter by date */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                DARI TANGGAL:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm w-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                HINGGA TANGGAL:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm w-32"
              />
            </div>

            {/* Reset Date Filter */}
            <button
              onClick={handleResetDateFilter}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
            >
              Reset ke H-20/H+20
            </button>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <span>
              Menampilkan {filteredJadwal.length} dari {jadwalList.length}{" "}
              jadwal
            </span>
            <span>Lewat: {stats.lewat}</span>
            <span>Hari ini: {stats.hariIni}</span>
            <span>Mendatang: {stats.mendatang}</span>
          </div>
        </div>

        {/* Jadwal List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600">Memuat data penilaian...</p>
            </div>
          ) : jadwalList.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600">
                Tidak ada jadwal penilaian yang ditemukan
              </p>
            </div>
          ) : (
            filteredJadwal.map((jadwal, idx) => {
              const isExpanded = isJadwalExpanded(jadwal);

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-lg border-2 p-6 ${
                    jadwal.statusKehadiran === "MENDATANG"
                      ? "border-green-300"
                      : jadwal.statusKehadiran === "HARI INI"
                      ? "border-yellow-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded font-semibold text-xs ${
                          jadwal.jenisSidang === "SIDANG"
                            ? "bg-blue-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {jadwal.jenisSidang}
                      </span>
                      {jadwal.statusKehadiran === "LEWAT" && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded font-semibold text-xs">
                          LEWAT
                        </span>
                      )}
                      {jadwal.statusKehadiran === "MENDATANG" && (
                        <span className="px-3 py-1 bg-green-200 text-green-700 rounded font-semibold text-xs">
                          MENDATANG
                        </span>
                      )}
                      {jadwal.statusKehadiran === "HARI INI" && (
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded font-semibold text-xs">
                          HARI INI
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // Cari semua jadwal dengan jadwalId yang sama
                        const jadwalIdsToToggle = filteredJadwal
                          .filter((j) => j.jadwalId === jadwal.jadwalId)
                          .map((j) => j.jadwalId);

                        // Toggle expand/collapse
                        if (isExpanded) {
                          // Jika sudah expanded, remove dari list
                          setExpandedJadwalIds(
                            expandedJadwalIds.filter(
                              (id) => !jadwalIdsToToggle.includes(id)
                            )
                          );
                        } else {
                          // Jika belum expanded, tambah semua jadwalId yang sama
                          setExpandedJadwalIds((prev) => [
                            ...new Set([...prev, ...jadwalIdsToToggle]),
                          ]);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? "↑ Tutup" : "↓ Detail"}
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {jadwal.nama}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {jadwal.nim} • {jadwal.tanggal} • {jadwal.waktu}
                  </p>
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    {jadwal.judul}
                  </p>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <>
                      <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                        <div className="space-y-4">
                          <p className="text-xs text-gray-500 mb-2 font-semibold">
                            📍 LOKASI
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {jadwal.lokasi}
                          </p>

                          <p className="text-xs text-gray-500 mb-2 font-semibold">
                            💎 CAPSTONE
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {jadwal.capstone || "-"}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <p className="text-xs text-gray-500 mb-2 font-semibold">
                            👥 PEMBIMBING 1
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {jadwal.pembimbing1}
                          </p>

                          <p className="text-xs text-gray-500 mb-2 font-semibold">
                            👥 PEMBIMBING 2
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {jadwal.pembimbing2 || "-"}
                          </p>

                          <p className="text-xs text-gray-500 mb-2 font-semibold">
                            👥 PENGUJI 1
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {jadwal.penguji1 || "-"}
                          </p>

                          <p className="text-xs text-gray-500 mb-2 font-semibold">
                            👥 PENGUJI 2
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {jadwal.penguji2 || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Links Section */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Laporan TA */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            LAPORAN TA
                          </p>
                          {jadwal.laporanTA ? (
                            <div className="flex items-start gap-2">
                              {jadwal.laporanTA.startsWith("http") ? (
                                <>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium whitespace-nowrap">
                                    TERBARU
                                  </span>
                                  <a
                                    href={jadwal.laporanTA}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline break-all"
                                  >
                                    {jadwal.laporanTA}
                                  </a>
                                </>
                              ) : (
                                <span className="text-xs text-gray-500 italic">
                                  {jadwal.laporanTA}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 italic">
                              -
                            </span>
                          )}
                        </div>

                        {/* Slide Presentasi */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            SLIDE PRESENTASI
                          </p>
                          {jadwal.slidePresentasi ? (
                            <div className="flex items-start gap-2">
                              {jadwal.slidePresentasi.startsWith("http") ? (
                                <>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium whitespace-nowrap">
                                    TERBARU
                                  </span>
                                  <a
                                    href={jadwal.slidePresentasi}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline break-all"
                                  >
                                    {jadwal.slidePresentasi}
                                  </a>
                                </>
                              ) : (
                                <span className="text-xs text-gray-500 italic">
                                  {jadwal.slidePresentasi}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 italic">
                              -
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Warning - for terkunci */}
                      {jadwal.statusPenilaian === "terkunci" && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                          <p className="text-sm text-yellow-800">
                            <strong>Yth Pembimbing Utama,</strong> mohon
                            pastikan pembimbing pendamping dan seluruh penguji
                            sudah menginput nilai sebelum seminar / sidang
                            berakhir. Selanjutnya pembimbing utama harus menekan
                            tombol finalisasi nilai, dan setelahnya mengklik
                            tombol generate BAP.
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {jadwal.statusPenilaian === "belum_dinilai" && (
                          <button
                            onClick={() => handleOpenPenilaian(jadwal)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                          >
                            Beri Nilai
                          </button>
                        )}

                        {jadwal.statusPenilaian === "sudah_dinilai" &&
                          jadwal.nilaiPertanyaan && (
                            <button
                              onClick={() => handleOpenPenilaian(jadwal)}
                              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium"
                            >
                              Edit Nilai
                            </button>
                          )}

                        {jadwal.statusPenilaian === "terkunci" && (
                          <button
                            onClick={() => handleOpenPenilaian(jadwal)}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 font-medium"
                          >
                            Terkunci
                          </button>
                        )}

                        {jadwal.isSupervisor1 && (
                          <button
                            onClick={() => handleOpenRekap(jadwal)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                          >
                            Lihat Nilai Dosen
                          </button>
                        )}

                        {jadwal.isSupervisor1 && (
                          <button
                            onClick={() => handleOpenKomentar(jadwal)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                          >
                            Lihat Komentar
                          </button>
                        )}

                        {jadwal.statusPenilaian === "terkunci" &&
                          jadwal.isSupervisor1 &&
                          jadwal.BAPUrl.pdfUrl === null && (
                            <button
                              onClick={() => handleGenerateBAP(jadwal)}
                              disabled={isGeneratingBAP}
                              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isGeneratingBAP ? (
                                <>
                                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Generate BAP...
                                </>
                              ) : (
                                "Generate BAP"
                              )}
                            </button>
                          )}

                        {jadwal.statusPenilaian === "terkunci" &&
                          jadwal.BAPUrl.pdfUrl !== null && (
                            <a
                              href={getPdfUrl(jadwal.BAPUrl.pdfUrl) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium inline-block"
                            >
                              Cek BAP
                            </a>
                          )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Penilaian */}
        {showPenilaianModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">Penilaian</h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Mahasiswa:{" "}
                    <span className="font-medium">{selectedJadwal?.nama}</span>{" "}
                    • {selectedJadwal?.jenisSidang} • {selectedJadwal?.capstone}
                  </p>
                  <p className="text-xs text-gray-600">
                    Judul:{" "}
                    <span className="font-medium">{selectedJadwal?.judul}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPenilaianModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-2">
                        Validasi Gagal
                      </p>
                      {validationErrors.map((error, idx) => (
                        <p key={idx} className="text-sm text-red-700 mb-1">
                          • {error.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rubrik Penilaian */}
                {selectedJadwal?.rubrik?.groups &&
                selectedJadwal.rubrik.groups.length > 0 ? (
                  selectedJadwal.rubrik.groups.map((group, groupIndex) => (
                    <div
                      key={group.id}
                      className={groupIndex > 0 ? "mt-6" : ""}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-gray-900">
                          {group.nama}
                        </h3>
                        <span className="text-sm text-gray-600">
                          Bobot {group.bobotTotal}
                        </span>
                      </div>
                      {group.pertanyaans && group.pertanyaans.length > 0 ? (
                        group.pertanyaans.map((pertanyaan) => {
                          const isLocked =
                            selectedJadwal?.statusPenilaian === "terkunci";
                          return (
                            <div
                              key={pertanyaan.id}
                              className="mb-4 bg-gray-50 border border-gray-200 rounded p-4"
                            >
                              <div className="mb-3">
                                <p className="text-sm text-gray-900 leading-relaxed mb-1">
                                  {pertanyaan.text}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Bobot {pertanyaan.bobot}
                                </p>
                              </div>
                              <select
                                value={nilaiPertanyaan[pertanyaan.id] || ""}
                                onChange={(e) => {
                                  setNilaiPertanyaan({
                                    ...nilaiPertanyaan,
                                    [pertanyaan.id]: parseInt(e.target.value),
                                  });
                                }}
                                disabled={isLocked}
                                className={`w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                                  isLocked
                                    ? "bg-gray-100 text-gray-600 cursor-not-allowed opacity-75"
                                    : ""
                                }`}
                              >
                                <option value="">Pilih Nilai</option>
                                {pertanyaan.opsiJawabans &&
                                pertanyaan.opsiJawabans.length > 0 ? (
                                  pertanyaan.opsiJawabans.map((opsi) => (
                                    <option key={opsi.id} value={opsi.nilai}>
                                      {opsi.text}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    Tidak ada opsi jawaban
                                  </option>
                                )}
                              </select>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Tidak ada pertanyaan dalam group ini
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-8">
                    Tidak ada rubrik/pertanyaan tersedia
                  </p>
                )}

                {/* Catatan */}
                <div className="mt-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Catatan untuk mahasiswa{" "}
                    <span className="text-gray-500 font-normal text-xs">
                      (Markdown didukung)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tulis umpan balik..."
                    value={catatanModal}
                    onChange={(e) => setCatatanModal(e.target.value)}
                    disabled={selectedJadwal?.statusPenilaian === "terkunci"}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      selectedJadwal?.statusPenilaian === "terkunci"
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed opacity-75"
                        : ""
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedJadwal?.statusPenilaian === "terkunci"
                      ? "Mode tampil - Nilai sudah difinalisasi"
                      : "Preview kosong."}
                  </p>
                </div>

                {/* Rekap Nilai Akhir */}
                <div className="mt-6 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded">
                    <div className="flex justify-between items-center gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">
                          Nilai Akhir (Realtime)
                        </p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {nilaiAkhirDosenIni !== null
                            ? nilaiAkhirDosenIni
                            : calculatedNilaiAkhir.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Nilai Huruf</p>
                        <p className="text-3xl font-bold text-indigo-600">
                          {nilaiHurufDosenIni !== null
                            ? nilaiHurufDosenIni
                            : calculatedNilaiHuruf}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      {selectedJadwal?.rentangNilai &&
                      selectedJadwal.rentangNilai.length > 0 ? (
                        <>
                          Rentang Nilai:{" "}
                          {selectedJadwal.rentangNilai
                            .sort(
                              (
                                a: { minScore: number },
                                b: { minScore: number }
                              ) => b.minScore - a.minScore
                            )
                            .map(
                              (
                                r: {
                                  id: string;
                                  grade: string;
                                  minScore: number;
                                },
                                idx: number
                              ) => (
                                <span key={r.id}>
                                  {r.grade} ≥ {r.minScore}
                                  {idx < selectedJadwal.rentangNilai.length - 1
                                    ? " • "
                                    : ""}
                                </span>
                              )
                            )}
                        </>
                      ) : (
                        "Rentang nilai tidak tersedia"
                      )}
                    </p>
                  </div>
                </div>

                {selectedJadwal?.statusPenilaian === "terkunci" && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Catatan:</strong> Nilai telah difinalisasi oleh{" "}
                      {selectedJadwal.rekap?.finalisasiOleh}. Mode tampilan
                      saja, tidak dapat diedit.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-4 flex gap-2 justify-end sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowPenilaianModal(false)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {selectedJadwal?.statusPenilaian === "terkunci"
                    ? "Tutup"
                    : "Batal"}
                </button>
                {selectedJadwal?.statusPenilaian !== "terkunci" && (
                  <button
                    onClick={handleSimpanNilai}
                    disabled={isSaving}
                    className={`px-4 py-2  text-white rounded ${
                      hasExistingValues(selectedJadwal?.nilaiPertanyaan)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } transition-colors font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2`}
                  >
                    {isSaving ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {hasExistingValues(selectedJadwal?.nilaiPertanyaan)
                          ? "Memperbarui..."
                          : "Menyimpan..."}
                      </>
                    ) : hasExistingValues(selectedJadwal?.nilaiPertanyaan) ? (
                      "Perbarui Nilai"
                    ) : (
                      "Simpan Nilai"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Rekap Nilai Dosen */}
        {showRekapModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="border-b pb-4 sticky top-0 bg-white z-10 p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">Rekap Nilai Dosen</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Informasi ringkas nilai dari semua dosen penguji dan
                    pembimbing
                  </p>
                </div>
                <button
                  onClick={() => setShowRekapModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      Rata2 Pembimbing :{" "}
                      {selectedJadwal?.rekap?.rata2Pembimbing || "-"}
                    </span>
                    <span className="font-semibold">
                      Rata2 Penguji :{" "}
                      {selectedJadwal?.rekap?.rata2Penguji || "-"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-4 py-2 bg-green-600 text-white rounded font-bold">
                      Nilai Akhir : {selectedJadwal?.rekap?.nilaiAkhir}
                    </span>
                  </div>
                </div>

                <table className="w-full border border-gray-300 mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Kode
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Nama Dosen
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Nilai
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedJadwal?.rekap?.detailPerDosen?.map(
                      (dosen, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            {dosen.kode}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {dosen.nama}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">
                            {dosen.nilai}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-600">
                            {formatDateTimeIndo(dosen.tanggal)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm">
                    <strong>
                      Nilai Huruf : {selectedJadwal?.rekap?.nilaiHuruf || "-"}
                    </strong>
                  </p>
                </div>

                {selectedJadwal?.rekap?.isFinalized && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm text-orange-800">
                      Telah difinalisasi oleh{" "}
                      {selectedJadwal?.rekap?.finalisasiOleh}. Nilai terkunci.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`border-t p-4 flex gap-2 sticky bottom-0 bg-white ${
                  selectedJadwal?.isCanFinalize &&
                  !selectedJadwal?.rekap?.isFinalized
                    ? "justify-between"
                    : "justify-end"
                } `}
              >
                <button
                  onClick={() => setShowRekapModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                >
                  Tutup
                </button>

                {selectedJadwal?.isCanFinalize &&
                  !selectedJadwal?.rekap?.isFinalized && (
                    <button
                      onClick={() => handleFinalisasi(selectedJadwal)}
                      disabled={isFinalizing}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isFinalizing ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Menginalisasi...
                        </>
                      ) : (
                        "Finalisasi Nilai"
                      )}
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Komentar */}
        {showKomentarModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) {
                setShowKomentarModal(false);
                setActiveKomentarKode(null);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="border-b pb-4 sticky top-0 bg-white z-10 p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">Komentar Dosen</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Lihat komentar dan umpan balik dari dosen pembimbing dan
                    penguji
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowKomentarModal(false);
                    setActiveKomentarKode(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="flex gap-2 mb-4">
                  {selectedJadwal?.komentar?.map((kom) => (
                    <button
                      key={kom.kode}
                      onClick={() => setActiveKomentarKode(kom.kode)}
                      className={`px-4 py-2 rounded font-semibold ${
                        activeKomentarKode === kom.kode
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {kom.kode}
                    </button>
                  ))}
                </div>

                {activeKomentarKode && (
                  <div className="border border-gray-300 rounded p-4">
                    {selectedJadwal?.komentar
                      ?.filter((k) => k.kode === activeKomentarKode)
                      .map((kom, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-gray-600 mb-2">
                            Oleh {kom.nama} • {formatDateTimeIndo(kom.tanggal)}
                          </p>
                          <div className="space-y-2">
                            {kom.komentar.split("\n").map((line, i) => (
                              <p key={i} className="text-sm text-gray-700">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {!activeKomentarKode && (
                  <p className="text-gray-500 text-center py-8">
                    Pilih dosen untuk melihat komentar
                  </p>
                )}
              </div>

              <div className="border-t p-4 flex gap-2 justify-end sticky bottom-0 bg-white">
                <button
                  onClick={() => {
                    setShowKomentarModal(false);
                    setActiveKomentarKode(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Signature Warning */}
        {showSignatureWarningModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Tanda Tangan Diperlukan
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Anda belum menambahkan tanda tangan pada profil. BAP tidak
                    dapat di-generate tanpa tanda tangan.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-sm text-blue-900">
                  Silakan buka halaman profil dan tambahkan tanda tangan Anda
                  terlebih dahulu, kemudian coba generate BAP lagi.
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSignatureWarningModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowSignatureWarningModal(false);
                    window.location.href = "/dosen/profile";
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Ke Profil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenilaianPage;
