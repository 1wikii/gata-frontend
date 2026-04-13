/**
 * Utility untuk mapping data dari API scheduler ke interface JadwalSidang
 */

import { JadwalSidang, JenisSidang } from "@/types/penilaian";

// Interface untuk data dari API scheduler
export interface ScheduleApiResponse {
  id: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  scheduler_status: string;
  original_idx: number;
  room: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  defense_submission: {
    id: number;
    defense_type: "proposal" | "hasil";
    status: string;
    guidance_sup_1_count: number;
    guidance_sup_2_count: number;
    min_guidance_sup_1_proposal: number;
    min_guidance_sup_2_proposal: number;
    min_guidance_hasil: number;
    student_notes: string | null;
    rejection_notes: string | null;
    processed_at: string;
    capstone_code: string;
    defense_date: string;
    created_at: string;
    updated_at: string;
    final_project: {
      id: number;
      type: string;
      status: string;
      source_topic: string;
      description: string | null;
      max_members: number;
      supervisor_1_status: string;
      supervisor_2_status: string;
      is_only_sup_1: boolean;
      admin_status: string;
      supervisor_1_note: string | null;
      supervisor_2_note: string | null;
      admin_note: string | null;
      created_at: string;
      updated_at: string;
      members: Array<{
        id: number;
        title: string;
        resume: string;
        draft_path: string;
        draft_filename: string;
        draft_size: string;
        dispen_path: string | null;
        dispen_filename: string | null;
        dispen_size: string | null;
        created_at: string;
        updated_at: string;
        student: {
          id: number;
          nim: string;
          semester: number;
          created_at: string;
          updated_at: string;
          user: {
            id: number;
            googleId: string | null;
            role: string;
            name: string;
            email: string;
            whatsapp_number: string | null;
            is_active: boolean;
            last_login: string | null;
            created_at: string;
            updated_at: string;
          };
        };
      }>;
    };
    examiner_1: {
      id: number;
      nip: string;
      lecturer_code: string | null;
      current_supervised_1: number;
      current_supervised_2: number;
      max_supervised_1: number;
      max_supervised_2: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        googleId: string | null;
        role: string;
        name: string;
        email: string;
        whatsapp_number: string | null;
        is_active: boolean;
        last_login: string | null;
        created_at: string;
        updated_at: string;
      };
    };
    examiner_2: {
      id: number;
      nip: string;
      lecturer_code: string | null;
      current_supervised_1: number;
      current_supervised_2: number;
      max_supervised_1: number;
      max_supervised_2: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        googleId: string | null;
        role: string;
        name: string;
        email: string;
        whatsapp_number: string | null;
        is_active: boolean;
        last_login: string | null;
        created_at: string;
        updated_at: string;
      };
    };
  };
}

/**
 * Map API response ke JadwalSidang interface
 */
export function mapScheduleToJadwalSidang(
  apiData: ScheduleApiResponse
): JadwalSidang {
  const submission = apiData.defense_submission;
  const project = submission.final_project;
  const student = project.members[0]?.student;
  const examiner1 = submission.examiner_1;
  const examiner2 = submission.examiner_2;

  // Tentukan jenis sidang berdasarkan defense_type
  const jenisSidang: JenisSidang =
    submission.defense_type === "proposal" ? "PROPOSAL" : "SIDANG";

  return {
    id: apiData.id.toString(),
    mahasiswaId: student?.id.toString() || "",
    mahasiswa: {
      id: student?.id.toString() || "",
      nim: student?.nim || "",
      name: student?.user.name || "",
    },
    jenisSidang,
    tanggal: apiData.scheduled_date,
    waktuMulai: apiData.start_time,
    waktuSelesai: apiData.end_time,
    judul: project.members[0]?.title || "",
    lokasi: apiData.room || "Belum ditentukan",
    capstone: submission.capstone_code,
    pembimbing1: {
      id: examiner1?.id.toString() || "",
      kode: examiner1?.nip || "",
      name: examiner1?.user.name || "",
    },
    pembimbing2: {
      id: examiner2?.id.toString() || "",
      kode: examiner2?.nip || "",
      name: examiner2?.user.name || "",
    },
    penguji1: {
      id: examiner1?.id.toString() || "",
      kode: examiner1?.nip || "",
      nama: examiner1?.user.name || "",
    },
    penguji2: {
      id: examiner2?.id.toString() || "",
      kode: examiner2?.nip || "",
      nama: examiner2?.user.name || "",
    },
    rubrikId: "", // Akan diisi dari sumber lain jika diperlukan
    laporanTA: project.members[0]?.draft_path || undefined,
    slidePresentasi: undefined,
    statusPenilaian: "belum_dinilai", // Default, akan diupdate berdasarkan data dari endpoint lain
    isFinalized: false,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
  };
}

/**
 * Map multiple API responses ke array JadwalSidang
 */
export function mapSchedulesToJadwalSidangList(
  apiDataList: ScheduleApiResponse[]
): JadwalSidang[] {
  return apiDataList.map(mapScheduleToJadwalSidang);
}

/**
 * Enrich JadwalSidang dengan status kehadiran
 */
export function enrichWithStatusKehadiran(jadwal: JadwalSidang): JadwalSidang {
  const jadwalDate = new Date(jadwal.tanggal);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  jadwalDate.setHours(0, 0, 0, 0);

  let statusKehadiran: "HARI INI" | "LEWAT" | "MENDATANG";
  if (jadwalDate < today) {
    statusKehadiran = "LEWAT";
  } else if (jadwalDate.getTime() === today.getTime()) {
    statusKehadiran = "HARI INI";
  } else {
    statusKehadiran = "MENDATANG";
  }

  return {
    ...jadwal,
    statusKehadiran,
  };
}

/**
 * Enrich multiple JadwalSidang dengan status kehadiran
 */
export function enrichListWithStatusKehadiran(
  jadwalList: JadwalSidang[]
): JadwalSidang[] {
  return jadwalList.map(enrichWithStatusKehadiran);
}
