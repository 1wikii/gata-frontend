"use client";

import React, { useState, useEffect } from "react";
import TugasAkhirPage from "@/containers/dosen/tugas-akhir-page";
import Loading from "@/components/ui/loading";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { FPApprovalRequest, FPAddSlotRequest } from "@/types/dosen";
import NotValidation from "@/components/ui/error/lecturer-not-validation";

export default function TugasAkhir() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnPeriod, setIsOnPeriod] = useState(false);

  // API call
  const getValidationStats = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(
          `/dosen/tugas-akhir/validasi-stats/${user.id}`
        );
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error("Error fetching validation stats:", error);
      throw error;
    }
  };

  const getValidationData = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(
          `/dosen/tugas-akhir/validasi/${user.id}`
        );
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error("Error fetching validation data:", error);
      throw error;
    }
  };

  // onApprove
  const onApproval = async (data: FPApprovalRequest): Promise<any> => {
    try {
      const response = await api.post(`/dosen/tugas-akhir/persetujuan`, data);

      return response;
    } catch (error) {
      console.error("Error approving final project:", error);
      throw error;
    }
  };

  // onAddSlot
  const onAddSlot = async (data: {
    supervisorType: "1" | "2";
    amount: number;
  }) => {
    try {
      if (user) {
        const payload: FPAddSlotRequest = {
          userId: parseInt(user.id),
          supervisorType: data.supervisorType,
          amount: data.amount,
        };

        const response = await api.post(
          `/dosen/tugas-akhir/tambah-slot`,
          payload
        );

        return response;
      }
    } catch (error) {
      console.error("Error adding slot:", error);
    }
  };

  const handleFirstLoad = async (): Promise<any> => {
    try {
      const response = await api.get("/dosen/tugas-akhir/periode");
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error during first load:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await handleFirstLoad();
      if (result && result.data) {
        setIsOnPeriod(true);
      } else {
        setIsOnPeriod(false);
      }

      setIsLoading(false);
      return;
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // if (!isOnPeriod) {
  //   return <NotValidation />;
  // }

  return (
    <TugasAkhirPage
      isPeriod={isOnPeriod}
      getValidationStats={getValidationStats}
      getValidationData={getValidationData}
      onApproval={onApproval}
      onAddSlot={onAddSlot}
    />
  );
}
