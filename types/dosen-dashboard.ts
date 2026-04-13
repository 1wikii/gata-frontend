/**
 * Dosen Dashboard Types
 * Types untuk halaman dashboard dosen
 */

export interface DosenStats {
  id: number;
  totalNewApplicants: number;
  newApplicantsThisWeek: number;
  totalActiveStudents: number;
  proposalStudents: number;
  resultsStudents: number;
  upcomingSchedulesThisMonth: number;
  upcomingSchedulesDaysAhead: number;
  completedGraduates: number;
  semesterInfo: string;
}

export interface Student {
  id: number;
  name: string;
  nim: string;
  email?: string;
}

export interface UpcomingSchedule {
  id: number;
  scheduleId: number;
  student: Student;
  studentName: string;
  jenisSidang: "proposal" | "hasil";
  title: string;
  supervisor: string;
  supervisorId?: number;
  date: string;
  time: string;
  endTime: string;
  room: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface GuidedStudent {
  id: number;
  studentId: number;
  name: string;
  nim: string;
  email?: string;
  jenisSidang: "proposal" | "hasil";
  status: "active" | "completed" | "pending";
  lastBimbinganDate?: string;
}

export interface GuidedStudentSummary {
  id: number;
  type: "proposal" | "hasil";
  totalCount: number;
  percentage: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  priority: "high" | "low";
  is_published: boolean;
}

export interface DosenDashboardData {
  stats: DosenStats;
  upcomingSchedules: UpcomingSchedule[];
  guidedStudents: GuidedStudent[];
  guidedStudentsSummary: GuidedStudentSummary[];
  announcements: Announcement[];
}
