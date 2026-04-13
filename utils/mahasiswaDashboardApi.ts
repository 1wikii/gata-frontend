/**
 * Mahasiswa Dashboard API Utilities
 * Handles all API calls for student dashboard data
 */

import { api } from "./api";
import {
  StudentProfile,
  GuidanceProgress,
  FinalProjectTimeline,
  UpcomingActivity,
  Announcement,
  MahasiswaDashboardData,
  ApiResponse,
  PaginatedResponse,
} from "@/types/mahasiswa-dashboard";

const API_ENDPOINTS = {
  PROFILE: "/mahasiswa/profile",
  GUIDANCE_PROGRESS: "/mahasiswa/dashboard/guidance-progress",
  TIMELINE: "/mahasiswa/dashboard/timeline",
  UPCOMING_ACTIVITIES: "/mahasiswa/dashboard/upcoming-activities",
  ANNOUNCEMENTS: "/mahasiswa/dashboard/announcements",
  DASHBOARD: "/mahasiswa/dashboard",
};

/**
 * Fetch complete dashboard data
 * Includes: profile, guidance progress, timeline, upcoming activities, announcements
 */
export const getMahasiswaDashboard = async (): Promise<
  ApiResponse<MahasiswaDashboardData>
> => {
  try {
    const response = await api.get(API_ENDPOINTS.DASHBOARD);
    return await response.json();
  } catch (error) {
    console.error("Error fetching mahasiswa dashboard:", error);
    throw error;
  }
};

/**
 * Fetch student profile information
 */
export const getStudentProfile = async (): Promise<
  ApiResponse<StudentProfile>
> => {
  try {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return await response.json();
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

/**
 * Fetch guidance progress for all supervisors
 * Returns: array of guidance progress with supervisor details and session counts
 */
export const getGuidanceProgress = async (): Promise<
  ApiResponse<GuidanceProgress[]>
> => {
  try {
    const response = await api.get(API_ENDPOINTS.GUIDANCE_PROGRESS);
    return await response.json();
  } catch (error) {
    console.error("Error fetching guidance progress:", error);
    throw error;
  }
};

/**
 * Fetch final project timeline/milestones
 * Returns: array of timeline items with status and dates
 */
export const getFinalProjectTimeline = async (): Promise<
  ApiResponse<FinalProjectTimeline[]>
> => {
  try {
    const response = await api.get(API_ENDPOINTS.TIMELINE);
    return await response.json();
  } catch (error) {
    console.error("Error fetching final project timeline:", error);
    throw error;
  }
};

/**
 * Fetch upcoming activities (guidance, exams, submissions, etc)
 * Query params:
 * - days: number of days to look ahead (default: 7)
 * - limit: max results (default: 5)
 */
export const getUpcomingActivities = async (
  days: number = 7,
  limit: number = 5
): Promise<ApiResponse<UpcomingActivity[]>> => {
  try {
    const url = `${API_ENDPOINTS.UPCOMING_ACTIVITIES}?days=${days}&limit=${limit}`;
    const response = await api.get(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching upcoming activities:", error);
    throw error;
  }
};

/**
 * Fetch announcements for student
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10)
 * - priority: filter by priority ('low' | 'high' | undefined for all)
 * - category: filter by category (e.g., 'akademik', 'pengumuman', etc)
 */
export const getAnnouncements = async (
  page: number = 1,
  limit: number = 10,
  priority?: "low" | "high",
  category?: string
): Promise<PaginatedResponse<Announcement>> => {
  try {
    let url = `${API_ENDPOINTS.ANNOUNCEMENTS}?page=${page}&limit=${limit}`;
    if (priority) url += `&priority=${priority}`;
    if (category) url += `&category=${category}`;

    const response = await api.get(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

/**
 * Fetch recent announcements only (latest 3-5)
 * Shortcut for getting most recent announcements
 */
export const getRecentAnnouncements = async (
  limit: number = 5
): Promise<ApiResponse<Announcement[]>> => {
  try {
    const url = `${API_ENDPOINTS.ANNOUNCEMENTS}?recent=true&limit=${limit}`;
    const response = await api.get(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching recent announcements:", error);
    throw error;
  }
};
