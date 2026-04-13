/**
 * Mahasiswa Dashboard Type Definitions
 * Defines all data structures for student dashboard
 */

// User/Student Profile
export interface StudentProfile {
  id: number;
  name: string;
  npm: string;
  email: string;
  phone?: string;
  avatar?: string;
  program_study: string;
}

// Supervisor/Dosen Info
export interface Supervisor {
  id: number;
  name: string;
  title: string;
  email: string;
  phone?: string;
}

// Guidance Session (Bimbingan)
export interface GuidanceSession {
  id: number;
  supervisor_id: number;
  supervisor: Supervisor;
  session_number: number;
  session_date: string;
  status: "completed" | "scheduled" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Guidance Progress
export interface GuidanceProgress {
  supervisor_id: number;
  supervisor: Supervisor;
  total_sessions: number;
  completed_sessions: number;
  progress_percentage: number;
  last_session_date?: string;
  status: "active" | "waiting" | "inactive";
}

// Final Project (Tugas Akhir) Timeline/Status
export interface FinalProjectTimeline {
  id: number;
  milestone: string;
  description: string;
  status: "completed" | "in_progress" | "not_started" | "cancelled";
  due_date: string;
  completed_date?: string;
  notes?: string;
}

// Upcoming Schedule/Activity
export interface UpcomingActivity {
  id: number;
  title: string;
  description?: string;
  activity_type: "guidance" | "exam" | "submission" | "other";
  scheduled_date: string;
  scheduled_time?: string;
  location?: string;
  supervisor_id?: number;
  supervisor?: Supervisor;
  urgency: "normal" | "medium" | "high";
  status: "upcoming" | "today" | "overdue";
  days_until: number;
}

// Announcement/Pengumuman
export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: "low" | "high";
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_guidance_sessions: number;
  completed_guidance_sessions: number;
  pending_revisions: number;
  upcoming_activities_count: number;
  completion_percentage: number;
}

// Main Dashboard Response
export interface MahasiswaDashboardData {
  profile: StudentProfile;
  stats: DashboardStats;
  guidance_progress: GuidanceProgress[];
  timeline: FinalProjectTimeline[];
  upcoming_activities: UpcomingActivity[];
  announcements: Announcement[];
}

// API Response Wrapper
export interface ApiResponse<T> {
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  status: number;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: PaginationMeta;
  status: number;
}
