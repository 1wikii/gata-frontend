import { DaysType } from "@/utils/dateHelper";

export interface KetersediaanDosen {
  id: number;
  day_of_week: DaysType;
  start_time: string; // format: HH:mm
  end_time: string; // format: HH:mm
  location: string;
  user_id?: number;
}
