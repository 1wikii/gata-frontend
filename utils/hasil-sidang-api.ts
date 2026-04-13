/**
 * Hasil Sidang API Utilities
 * Handles all API calls for student final examination results (BAP)
 */

import { api } from "./api";
import type {
  HasilSidang,
  HasilSidangResponse,
  HasilSidangListResponse,
} from "@/types/hasil-sidang";

const API_ENDPOINTS = {
  HASIL_SIDANG: "/mahasiswa/hasil-sidang",
  HASIL_SIDANG_BY_ID: (studentId: string) =>
    `/mahasiswa/hasil-sidang/${studentId}`,
};

/**
 * Fetch hasil sidang (BAP results) for current student
 * Returns the student's final examination results with all assessors' scores
 */
export const getHasilSidang = async (
  studentId: string
): Promise<HasilSidangResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.HASIL_SIDANG_BY_ID(studentId));

    if (!response.ok) {
      const errorData = (await response.json()) as HasilSidangResponse;
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch hasil sidang: ${response.statusText}`,
        errors: errorData.errors,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching hasil sidang:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch hasil sidang",
      errors: [{ message: "Network or server error occurred" }],
    };
  }
};

/**
 * Fetch all hasil sidang records (for admin or overview)
 * Returns a list of all final examination results
 */
export const getAllHasilSidang = async (): Promise<HasilSidangListResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.HASIL_SIDANG);

    if (!response.ok) {
      const errorData = (await response.json()) as HasilSidangListResponse;
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch hasil sidang list: ${response.statusText}`,
        errors: errorData.errors,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching hasil sidang list:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch hasil sidang",
      errors: [{ message: "Network or server error occurred" }],
    };
  }
};

/**
 * Download BAP PDF for the student's examination results
 * Returns the PDF URL or triggers download
 */
export const downloadBAPPdf = async (studentId: string): Promise<string> => {
  try {
    const response = await api.get(
      `/mahasiswa/hasil-sidang/${studentId}/download-bap`
    );

    if (!response.ok) {
      throw new Error(`Failed to download BAP: ${response.statusText}`);
    }

    const data = (await response.json()) as HasilSidangResponse;

    if (data.data?.bapUrl) {
      return data.data.bapUrl;
    }

    throw new Error("No BAP URL found in response");
  } catch (error) {
    console.error("Error downloading BAP:", error);
    throw error;
  }
};
