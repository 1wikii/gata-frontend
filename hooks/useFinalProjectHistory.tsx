"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";

export const useFinalProjectHistory = () => {
  const { user, isLoading } = useAuth();
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const [isCheckingHistory, setIsCheckingHistory] = useState(true);

  useEffect(() => {
    const checkHistory = async () => {
      try {
        if (!isLoading && user && user.role === "student") {
          const response = await api.get(
            `/mahasiswa/tugas-akhir/riwayat/${user.id}`
          );
          const result = await response.json();

          // Check if history data exists and admin_status is approved
          if (
            result &&
            result.data &&
            result.data.data &&
            result.data.data.admin_status === "approved"
          ) {
            setHasHistory(true);
          } else {
            setHasHistory(false);
          }
        } else {
          setHasHistory(false);
        }
      } catch (error) {
        console.error("Error checking final project history:", error);
        setHasHistory(false);
      } finally {
        setIsCheckingHistory(false);
      }
    };

    if (!isLoading) {
      checkHistory();
    }
  }, [user, isLoading]);

  return { hasHistory, isCheckingHistory };
};
