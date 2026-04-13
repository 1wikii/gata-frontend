import { DaysType } from "@/utils/dateHelper";

export type TipeTA = "regular" | "capstone";
export type StatusBimbingan =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "no_show"
  | "cancelled";

export type ActionType = "mulai" | "selesai" | "batalkan" | "tidak_hadir";

export interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
}

export interface DraftLink {
  id: number;
  name: string;
  url: string;
  uploaded_at?: string;
}

export interface JadwalBimbingan {
  id: number;
  day_of_week: DaysType;
  session_date: string; // format: YYYY-MM-DD
  start_time: string; // format: HH:mm
  end_time: string; // format: HH:mm
  tipeTA: TipeTA;
  location: string;
  defense_type: "proposal" | "hasil";
  topic: string;
  lecturer_feedback?: string;
  status: StatusBimbingan;
  mahasiswa: Mahasiswa[];
  draftLinks?: DraftLink[];
}

export interface WeekSchedule {
  weekStart: string; // Monday date
  weekEnd: string; // Friday date
  schedules: JadwalBimbingan[];
}
