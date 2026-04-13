import { DaysType } from "@/utils/dateHelper";

export interface DosenOption {
  id: number;
  fpId?: number;
  nama: string;
  nip: string;
  lecturer_code: string;
  supervisor_type: 1 | 2;
  availability: SlotWaktu[];
}

export interface SlotWaktu {
  id: number;
  day_of_week: DaysType;
  start_time: string;
  end_time: string;
  location: string;
}

export interface DraftLink {
  id: string;
  name: string;
  url: string;
}

export interface PengajuanBimbinganForm {
  fpId: number;
  lecturerId: number;
  GAId: number;
  topic: string;
  supervisor_type: 1 | 2;
  draftLinks: DraftLink[];
}

export interface PengajuanBimbinganSubmit {
  dosenId: number;
  slotWaktuId: number;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  topik: string;
  catatan?: string;
  draftLinks: {
    nama: string;
    url: string;
  }[];
}

export interface PengajuanBimbinganData {
  id: number;
  lecture_name: string;
  lecture_nip: string;
  day_of_week: DaysType;
  session_date: string;
  start_time: string;
  end_time: string;
  topic: string;
  location: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled" | "no_show";
  created_at: string;
  draftLinks: {
    id: number;
    name: string;
    url: string;
  }[];
  lecturer_feedback?: string;
}
