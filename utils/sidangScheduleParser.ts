// Parser untuk CSV data jadwal sidang
export interface SidangScheduleRow {
  id: number;
  nim: string;
  name: string;
  judul: string;
  capstone_code: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  spv_1: string;
  spv_2: string;
  examiner_1: string;
  examiner_2: string;
  status: string;
  location: string;
}

export interface SidangScheduleRequest {
  pengajuanId: number;
  tanggal: string;
  mulai: string;
  selesai: string;
  type: string;
  lokasi: string;
  judul: string;
  nim: string;
  namaMahasiswa: string;
  capstone?: string;
  pembimbing1: string;
  pembimbing2?: string;
  penguji1?: string;
  penguji2?: string;
}

export interface GroupedSchedule {
  [dateKey: string]: {
    date: string;
    schedules: SidangScheduleRow[];
  };
}

// Parse tanggal dari format "Senin, 15 September 2025"
export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.trim() === "") return null;

  try {
    // Format: "Senin, 15 September 2025"
    const parts = dateStr.split(",");
    if (parts.length !== 2) return null;

    const dateParts = parts[1].trim().split(" ");
    if (dateParts.length !== 3) return null;

    const day = parseInt(dateParts[0], 10);
    const monthName = dateParts[1];
    const year = parseInt(dateParts[2], 10);

    const months: { [key: string]: number } = {
      januari: 0,
      februari: 1,
      maret: 2,
      april: 3,
      mei: 4,
      juni: 5,
      juli: 6,
      agustus: 7,
      september: 8,
      oktober: 9,
      november: 10,
      desember: 11,
    };

    const month = months[monthName.toLowerCase()] ?? -1;
    if (month === -1) return null;

    return new Date(year, month, day);
  } catch {
    return null;
  }
};

// Filter dan validasi jadwal (hanya yang memiliki Date, Start Time, End Time)
export const filterValidSchedules = (
  schedules: SidangScheduleRow[]
): SidangScheduleRow[] => {
  return schedules.filter(
    (schedule) =>
      schedule.date &&
      schedule.date.trim() !== "" &&
      schedule.startTime &&
      schedule.startTime.trim() !== "" &&
      schedule.endTime &&
      schedule.endTime.trim() !== ""
  );
};

// Group jadwal berdasarkan tanggal
export const groupSchedulesByDate = (
  schedules: SidangScheduleRow[]
): GroupedSchedule => {
  const grouped: GroupedSchedule = {};

  schedules.forEach((schedule) => {
    const dateKey = schedule.date;
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        schedules: [],
      };
    }
    grouped[dateKey].schedules.push(schedule);
  });

  // Sort schedules dalam setiap tanggal berdasarkan start time
  Object.keys(grouped).forEach((key) => {
    grouped[key].schedules.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });

  return grouped;
};

// Sort grouped schedules berdasarkan tanggal
export const sortGroupedSchedules = (
  grouped: GroupedSchedule
): Array<[string, GroupedSchedule[string]]> => {
  return Object.entries(grouped).sort((a, b) => {
    const dateA = parseDate(a[0]);
    const dateB = parseDate(b[0]);

    if (!dateA || !dateB) return 0;
    return dateA.getTime() - dateB.getTime();
  });
};
