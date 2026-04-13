import type {
  Penilaian,
  JawabanPenilaian,
  RubrikGroup,
  Pertanyaan,
  RentangNilai,
} from "@/types/penilaian";

// ============================================
// REAL-TIME CALCULATION HELPERS (NEW)
// ============================================

/**
 * Interface untuk struktur grup pertanyaan yang sudah disederhanakan
 */
export interface RubricGroupCalculation {
  groupWeight: number;
  questions: {
    questionWeight: number;
    maxOptionValue: number;
    selectedOptionValue: number | null;
  }[];
}

/**
 * Interface untuk rentang nilai
 */
export interface GradeRange {
  grade: string;
  minScore: number;
}

/**
 * Hitung persentase final dari rubrik
 * Formula: Σ(groupScore) / Σ(groupWeight) * 100
 * dimana groupScore = (Σ(normalizedQuestion * questionWeight) / Σ(questionWeight)) * groupWeight
 */
export const computeFinalPercent = (
  rubricGroups: RubricGroupCalculation[]
): number => {
  let totalGroupWeighted = 0;
  let totalGroupWeight = 0;

  for (const g of rubricGroups) {
    const gw = g.groupWeight || 0;
    const qs = g.questions || [];
    let sumWeightedQuestions = 0;
    let sumQuestionWeights = 0;

    for (const q of qs) {
      const qw = q.questionWeight || 0;
      const maxOpt = q.maxOptionValue || 1;
      const sel =
        typeof q.selectedOptionValue === "number" ? q.selectedOptionValue : 0;

      const norm = maxOpt > 0 ? sel / maxOpt : 0; // normalize to 0..1
      const weightedQ = norm * qw;
      sumWeightedQuestions += weightedQ;
      sumQuestionWeights += qw;
    }

    // Jika grup tidak punya pertanyaan atau sumQuestionWeights==0, treat groupScore = 0
    const groupScore =
      sumQuestionWeights > 0
        ? (sumWeightedQuestions / sumQuestionWeights) * gw
        : 0;

    totalGroupWeighted += groupScore;
    totalGroupWeight += gw;
  }

  const finalPercent =
    totalGroupWeight > 0 ? (totalGroupWeighted / totalGroupWeight) * 100 : 0;

  return finalPercent;
};

/**
 * Map persentase ke nilai huruf berdasarkan rentang
 */
export const mapPercentToLetter = (
  percent: number,
  gradeRanges: GradeRange[]
): string => {
  // Sort desc by minScore
  const sorted = [...gradeRanges].sort((a, b) => b.minScore - a.minScore);

  for (const r of sorted) {
    if (percent >= r.minScore) {
      return r.grade;
    }
  }

  return "E"; // Default fallback
};

/**
 * Convert dari struktur Jadwal ke RubricGroupCalculation
 * Mapping:
 * - group.bobotTotal -> groupWeight
 * - pertanyaan.bobot -> questionWeight
 * - opsiJawaban.nilai.max -> maxOptionValue
 * - nilaiPertanyaan[pertanyaanId] -> selectedOptionValue
 */
export const convertRubricToCalculation = (
  groups: Array<{
    id: string;
    nama: string;
    bobotTotal: number;
    pertanyaans: Array<{
      id: string;
      text: string;
      bobot: number;
      opsiJawabans: Array<{ nilai: number }>;
    }>;
  }>,
  nilaiPertanyaan: { [key: string]: number }
): RubricGroupCalculation[] => {
  return groups.map((group) => ({
    groupWeight: group.bobotTotal,
    questions: group.pertanyaans.map((pertanyaan) => {
      // Find max option value
      const maxOptionValue =
        pertanyaan.opsiJawabans.length > 0
          ? Math.max(...pertanyaan.opsiJawabans.map((opt) => opt.nilai))
          : 1;

      return {
        questionWeight: pertanyaan.bobot,
        maxOptionValue,
        selectedOptionValue: nilaiPertanyaan[pertanyaan.id] ?? null,
      };
    }),
  }));
};

/**
 * Hitung nilai akhir dan huruf secara realtime
 * Return { percent: number, letter: string }
 */
export const calculateRealtimeNilai = (
  groups: Array<{
    id: string;
    nama: string;
    bobotTotal: number;
    pertanyaans: Array<{
      id: string;
      text: string;
      bobot: number;
      opsiJawabans: Array<{ nilai: number }>;
    }>;
  }>,
  nilaiPertanyaan: { [key: string]: number },
  rentangNilai: GradeRange[]
): { percent: number; letter: string } => {
  const rubricCalc = convertRubricToCalculation(groups, nilaiPertanyaan);
  const percent = computeFinalPercent(rubricCalc);
  const letter = mapPercentToLetter(percent, rentangNilai);

  return {
    percent: Math.round(percent * 100) / 100, // Round to 2 decimals
    letter,
  };
};

// ============================================
// CALCULATION HELPERS (EXISTING)
// ============================================

/**
 * Calculate nilai for a single group
 * Formula: Σ(nilai × bobot) / Σ(bobot)
 */
export const calculateNilaiGroup = (
  jawaban: JawabanPenilaian[],
  pertanyaans: Pertanyaan[]
): number => {
  let totalPoin = 0;
  let totalBobot = 0;

  jawaban.forEach((j) => {
    const pertanyaan = pertanyaans.find((p) => p.id === j.pertanyaanId);
    if (pertanyaan) {
      totalPoin += j.nilai * pertanyaan.bobot;
      totalBobot += pertanyaan.bobot;
    }
  });

  return totalBobot > 0 ? totalPoin / totalBobot : 0;
};

/**
 * Calculate nilai akhir dosen (skala 0-100)
 * Formula: Σ(nilaiGroup × bobotGroup) / Σ(bobotGroup) × 20
 */
export const calculateNilaiAkhirDosen = (
  jawaban: JawabanPenilaian[],
  groups: RubrikGroup[]
): number => {
  let totalPoin = 0;
  let totalBobot = 0;

  groups.forEach((group) => {
    const jawabanGroup = jawaban.filter((j) =>
      group.pertanyaans.some((p) => p.id === j.pertanyaanId)
    );
    const nilaiGroup = calculateNilaiGroup(jawabanGroup, group.pertanyaans);
    totalPoin += nilaiGroup * group.bobotTotal;
    totalBobot += group.bobotTotal;
  });

  const nilaiSkala5 = totalBobot > 0 ? totalPoin / totalBobot : 0;
  return nilaiSkala5 * 20; // Convert to 0-100 scale
};

/**
 * Calculate rekap nilai mahasiswa
 * Formula:
 * - rata2Pembimbing = (pembimbing1 + pembimbing2) / 2
 * - rata2Penguji = (penguji1 + penguji2) / 2
 * - nilaiAkhir = (rata2Pembimbing + rata2Penguji) / 2
 */
export const calculateRekapNilai = (penilaians: Penilaian[]) => {
  const pembimbing = penilaians.filter((p) =>
    ["pembimbing1", "pembimbing2"].includes(p.roleDosen)
  );
  const penguji = penilaians.filter((p) =>
    ["penguji1", "penguji2"].includes(p.roleDosen)
  );

  const rata2Pembimbing =
    pembimbing.length > 0
      ? pembimbing.reduce((sum, p) => sum + p.nilaiAkhir, 0) / pembimbing.length
      : 0;

  const rata2Penguji =
    penguji.length > 0
      ? penguji.reduce((sum, p) => sum + p.nilaiAkhir, 0) / penguji.length
      : 0;

  const nilaiAkhir = (rata2Pembimbing + rata2Penguji) / 2;

  return {
    rata2Pembimbing: Number(rata2Pembimbing.toFixed(2)),
    rata2Penguji: Number(rata2Penguji.toFixed(2)),
    nilaiAkhir: Number(nilaiAkhir.toFixed(2)),
  };
};

/**
 * Get nilai huruf based on score and rentang nilai
 */
export const getNilaiHuruf = (
  score: number,
  rentangNilai: RentangNilai[]
): string => {
  // Sort by urutan ascending
  const sorted = [...rentangNilai].sort((a, b) => a.urutan - b.urutan);

  // Find first grade where score >= minScore
  for (const range of sorted) {
    if (score >= range.minScore && score <= range.maxScore) {
      return range.grade;
    }
  }

  // Default to E if no match
  return "E";
};

/**
 * Calculate breakdown per group for display
 */
export const calculateBreakdown = (
  jawaban: JawabanPenilaian[],
  groups: RubrikGroup[]
) => {
  const groupBreakdowns = groups.map((group) => {
    const jawabanGroup = jawaban.filter((j) =>
      group.pertanyaans.some((p) => p.id === j.pertanyaanId)
    );

    const pertanyaanDetails = jawabanGroup.map((j) => {
      const pertanyaan = group.pertanyaans.find((p) => p.id === j.pertanyaanId);
      return {
        text: pertanyaan?.text || "",
        bobot: pertanyaan?.bobot || 0,
        nilai: j.nilai,
        poin: j.nilai * (pertanyaan?.bobot || 0),
      };
    });

    const totalPoin = pertanyaanDetails.reduce((sum, p) => sum + p.poin, 0);
    const totalBobot = pertanyaanDetails.reduce((sum, p) => sum + p.bobot, 0);
    const nilaiGroup = totalBobot > 0 ? totalPoin / totalBobot : 0;

    return {
      groupNama: group.nama,
      bobotGroup: group.bobotTotal,
      nilaiGroup: Number(nilaiGroup.toFixed(2)),
      pertanyaans: pertanyaanDetails,
      totalPoin: Number(totalPoin.toFixed(2)),
      totalBobot,
    };
  });

  const totalPoin = groupBreakdowns.reduce((sum, g) => sum + g.totalPoin, 0);
  const totalBobotMaksimal = groups.reduce(
    (sum, g) =>
      sum +
      g.bobotTotal * g.pertanyaans.reduce((pSum, p) => pSum + p.bobot, 0) * 5,
    0
  ); // Max nilai is 5
  const nilaiAkhir = calculateNilaiAkhirDosen(jawaban, groups);

  return {
    groups: groupBreakdowns,
    totalPoin: Number(totalPoin.toFixed(2)),
    totalBobotMaksimal: Number(totalBobotMaksimal.toFixed(2)),
    nilaiAkhir: Number(nilaiAkhir.toFixed(2)),
  };
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate if all pertanyaans are answered
 */
export const validateAllAnswered = (
  jawaban: JawabanPenilaian[],
  groups: RubrikGroup[]
): { isValid: boolean; missing: string[] } => {
  const allPertanyaans = groups.flatMap((g) => g.pertanyaans);
  const answeredIds = new Set(jawaban.map((j) => j.pertanyaanId));

  const missing = allPertanyaans
    .filter((p) => !answeredIds.has(p.id))
    .map((p) => p.text);

  return {
    isValid: missing.length === 0,
    missing,
  };
};

/**
 * Validate nilai range (0-5)
 */
export const validateNilaiRange = (nilai: number): boolean => {
  return nilai >= 0 && nilai <= 5;
};

/**
 * Check if dosen can finalize
 * Only pembimbing1 can finalize
 */
export const canFinalize = (roleDosen: string): boolean => {
  return roleDosen === "pembimbing1";
};

/**
 * Check if all dosen have submitted penilaian
 */
export const checkAllDosenSubmitted = (
  penilaians: Penilaian[],
  totalDosen: number = 4
): boolean => {
  return penilaians.length >= totalDosen;
};

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format date for display
 */
export const formatTanggal = (date: string | Date): string => {
  const d = new Date(date);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
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

  const dayName = days[d.getDay()];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
};

/**
 * Format score to 2 decimal places
 */
export const formatScore = (score: number): string => {
  return score.toFixed(2);
};

/**
 * Format percentage
 */
export const formatPercentage = (score: number): string => {
  return `${score.toFixed(2)}%`;
};

/**
 * Get status kehadiran based on date
 */
export const getStatusKehadiran = (
  tanggal: string | Date
): "HARI INI" | "LEWAT" | "MENDATANG" => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const jadwalDate = new Date(tanggal);
  jadwalDate.setHours(0, 0, 0, 0);

  if (jadwalDate.getTime() === today.getTime()) {
    return "HARI INI";
  } else if (jadwalDate < today) {
    return "LEWAT";
  } else {
    return "MENDATANG";
  }
};

/**
 * Get status badge color
 */
export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "belum_dinilai":
      return "bg-yellow-100 text-yellow-700";
    case "sudah_dinilai":
      return "bg-green-100 text-green-700";
    case "terkunci":
      return "bg-gray-100 text-gray-700";
    case "HARI INI":
      return "bg-yellow-200 text-yellow-700";
    case "LEWAT":
      return "bg-gray-200 text-gray-700";
    case "MENDATANG":
      return "bg-green-200 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * Get jenis sidang badge color
 */
export const getJenisSidangColor = (jenis: string): string => {
  switch (jenis) {
    case "SIDANG":
      return "bg-blue-500 text-white";
    case "PROPOSAL":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// ============================================
// UTILITY HELPERS
// ============================================

/**
 * Group pertanyaans by group
 */
export const groupPertanyaansByGroup = (groups: RubrikGroup[]) => {
  return groups.map((group) => ({
    groupId: group.id,
    groupNama: group.nama,
    bobotTotal: group.bobotTotal,
    pertanyaans: group.pertanyaans,
  }));
};

/**
 * Sort by urutan
 */
export const sortByUrutan = <T extends { urutan: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.urutan - b.urutan);
};

/**
 * Generate date range for filter (H-20 to H+20)
 */
export const getDefaultDateRange = (): {
  startDate: string;
  endDate: string;
} => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 20);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 20);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

/**
 * Convert date format from MM/DD/YYYY to YYYY-MM-DD
 */
export const convertDateFormat = (date: string): string => {
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/**
 * Debounce function for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Check if rubrik is complete (has groups, pertanyaans, opsi)
 */
export const isRubrikComplete = (groups: RubrikGroup[]): boolean => {
  if (groups.length === 0) return false;

  for (const group of groups) {
    if (group.pertanyaans.length === 0) return false;

    for (const pertanyaan of group.pertanyaans) {
      if (pertanyaan.opsiJawaban.length === 0) return false;
    }
  }

  return true;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (
  answeredCount: number,
  totalCount: number
): number => {
  if (totalCount === 0) return 0;
  return Math.round((answeredCount / totalCount) * 100);
};

// ============================================
// SIMPAN NILAI VALIDATION
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validasi nilai penilaian sebelum dikirim ke server
 */
export const validateSimpanNilai = (
  nilaiPertanyaan: { [key: string]: number },
  catatan: string,
  totalPertanyaan: number
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validasi semua pertanyaan memiliki nilai
  const nilaiValues = Object.values(nilaiPertanyaan).filter(
    (val) => val !== undefined && val !== null
  );

  if (nilaiValues.length === 0) {
    errors.push({
      field: "nilaiPertanyaan",
      message: "Semua pertanyaan harus memiliki nilai",
    });
  } else if (nilaiValues.length < totalPertanyaan) {
    const missingCount = totalPertanyaan - nilaiValues.length;
    errors.push({
      field: "nilaiPertanyaan",
      message: `${missingCount} pertanyaan masih belum diberi nilai`,
    });
  }

  // Validasi catatan
  if (!catatan || catatan.trim().length === 0) {
    errors.push({
      field: "catatan",
      message: "Catatan tidak boleh kosong",
    });
  } else if (catatan.trim().length < 10) {
    errors.push({
      field: "catatan",
      message: "Catatan minimal 10 karakter",
    });
  }

  return errors;
};

/**
 * Hitung total pertanyaan dari rubrik
 */
export const getTotalPertanyaanFromRubrik = (
  groups: Array<{ pertanyaans: Array<any> }>
): number => {
  return groups.reduce((total, group) => {
    return total + (group.pertanyaans?.length || 0);
  }, 0);
};

/**
 * Format error message untuk ditampilkan di UI
 */
export const formatErrorMessage = (errors: ValidationError[]): string => {
  return errors.map((e) => `• ${e.message}`).join("\n");
};

/**
 * Interface untuk request simpan nilai
 */
export interface SimpanNilaiRequest {
  jadwalId: number;
  userId: number;
  studentId: number;
  nilaiPertanyaan: {
    [pertanyaanId: string]: number;
  };
  nilaiAkhir: number;
  nilaiHuruf: string;
  catatan: string;
  penilaianId?: string; // Optional untuk update, diisi jika sudah ada nilai sebelumnya
}

/**
 * Interface untuk response simpan nilai
 */
export interface SimpanNilaiResponse {
  success: boolean;
  message: string;
  data?: {
    penilaianId: string;
    jadwalId: string;
    dosenId: string;
    nilaiAkhir: number;
    nilaiHuruf: string;
    catatanDisimpan: boolean;
    tanggalDisimpan: string;
  };
  errors?: ValidationError[];
}

/**
 * Detect apakah ada nilai existing (update) atau baru (create)
 */
export const hasExistingValues = (
  nilaiPertanyaan: { [key: string]: number | string } | undefined
): boolean => {
  if (!nilaiPertanyaan || typeof nilaiPertanyaan !== "object") {
    return false;
  }

  const values = Object.values(nilaiPertanyaan).filter(
    (val) => val !== undefined && val !== null && val !== ""
  );

  return values.length > 0;
};

/**
 * Convert string nilai to number
 */
export const convertNilaiToNumber = (nilaiPertanyaan: {
  [key: string]: number | string;
}): { [key: string]: number } => {
  const result: { [key: string]: number } = {};

  Object.entries(nilaiPertanyaan).forEach(([key, value]) => {
    result[key] = typeof value === "string" ? parseFloat(value) : value;
  });

  return result;
};
