/**
 * Scheduler API Client
 * Utility functions untuk komunikasi dengan Scheduler API
 */

const BASE_URL = "/api/scheduler";

// Types
export interface SchedulerConfig {
  req_fname: string;
  avail_fname: string;
  parallel_event: number;
  default_timeslot: number;
  default_timeslot_sidang: number;
  capstone_duration_2: number;
  capstone_duration_3: number;
  capstone_duration_4: number;
  capstone_duration_sidang_2: number;
  capstone_duration_sidang_3: number;
  capstone_duration_sidang_4: number;
  out_fname: string;
  out_timeslot: string;
  out_lectureschedule: string;
  time_slot_dur: number;
}

export interface SchedulerStatus {
  running: boolean;
  completed: boolean;
  error: string | null;
  output: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
  output?: string;
  filename?: string;
  input_files?: string[];
  output_files?: string[];
  config?: SchedulerConfig;
}

// API Client Class
class SchedulerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get files and configuration
   */
  async getFilesAndConfig(): Promise<{
    inputFiles: string[];
    outputFiles: string[];
    config: SchedulerConfig;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/files`);
      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch files and config");
      }

      return {
        inputFiles: data.input_files || [],
        outputFiles: data.output_files || [],
        config: data.config || this.getDefaultConfig(),
      };
    } catch (error) {
      console.error("Error fetching files and config:", error);
      throw error;
    }
  }

  /**
   * Upload file
   */
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to upload file");
      }

      return data.filename || file.name;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  /**
   * Save configuration
   */
  async saveConfig(config: SchedulerConfig): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      throw error;
    }
  }

  /**
   * Run scheduler
   */
  async runScheduler(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/run`, {
        method: "POST",
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start scheduler");
      }
    } catch (error) {
      console.error("Error running scheduler:", error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  async getStatus(): Promise<SchedulerStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      const data: SchedulerStatus = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting status:", error);
      throw error;
    }
  }

  /**
   * Download file
   */
  downloadFile(filename: string): void {
    try {
      window.location.href = `${this.baseUrl}/download/${filename}`;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  /**
   * Validate file
   */
  async validateFile(filename: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/validate/${filename}`);
      const data: ApiResponse = await response.json();

      if (!data.success && data.error) {
        return data.error;
      }

      return data.output || "Validation completed";
    } catch (error) {
      console.error("Error validating file:", error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(filename: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${filename}`, {
        method: "DELETE",
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): SchedulerConfig {
    return {
      req_fname: "",
      avail_fname: "",
      parallel_event: 1,
      default_timeslot: 30,
      default_timeslot_sidang: 45,
      capstone_duration_2: 45,
      capstone_duration_3: 60,
      capstone_duration_4: 75,
      capstone_duration_sidang_2: 60,
      capstone_duration_sidang_3: 75,
      capstone_duration_sidang_4: 90,
      out_fname: "schedule_output.csv",
      out_timeslot: "timeslot_output.csv",
      out_lectureschedule: "lecture_schedule.csv",
      time_slot_dur: 30,
    };
  }

  /**
   * Poll scheduler status until completion
   */
  async pollStatus(
    onStatusUpdate?: (status: SchedulerStatus) => void,
    intervalMs: number = 1000,
    maxRetries: number = 0
  ): Promise<SchedulerStatus> {
    return new Promise((resolve, reject) => {
      let retries = 0;
      const interval = setInterval(async () => {
        try {
          const status = await this.getStatus();

          if (onStatusUpdate) {
            onStatusUpdate(status);
          }

          if (!status.running) {
            clearInterval(interval);
            resolve(status);
          }

          retries = 0;
        } catch (error) {
          retries++;

          if (maxRetries > 0 && retries >= maxRetries) {
            clearInterval(interval);
            reject(error);
          }
        }
      }, intervalMs);
    });
  }
}

// Export singleton instance
export const schedulerApi = new SchedulerApiClient();

// Export class for testing or multiple instances
export default SchedulerApiClient;
