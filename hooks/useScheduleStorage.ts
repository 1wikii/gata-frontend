import { useState, useEffect } from "react";
import { SidangScheduleRow } from "@/utils/sidangScheduleParser";

const STORAGE_KEY = "sidang_schedule_data";
const STORAGE_VERSION = "1";

interface StorageData {
  version: string;
  timestamp: number;
  schedules: SidangScheduleRow[];
  fileName: string;
}

export const useScheduleStorage = (initialData: SidangScheduleRow[] = []) => {
  const [schedules, setSchedules] = useState<SidangScheduleRow[]>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data dari localStorage saat component mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: StorageData = JSON.parse(stored);
          // Validasi version
          if (data.version === STORAGE_VERSION && data.schedules) {
            setSchedules(data.schedules);
          }
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFromStorage();
  }, []);

  // Save data ke localStorage setiap kali schedules berubah
  const saveSchedules = (
    newSchedules: SidangScheduleRow[],
    fileName: string = ""
  ) => {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        schedules: newSchedules,
        fileName,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSchedules(newSchedules);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Clear data dari localStorage
  const clearSchedules = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSchedules([]);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  // Get data dari localStorage
  const getStoredData = (): StorageData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error getting stored data:", error);
      return null;
    }
  };

  return {
    schedules,
    setSchedules,
    saveSchedules,
    clearSchedules,
    getStoredData,
    isLoaded,
  };
};
