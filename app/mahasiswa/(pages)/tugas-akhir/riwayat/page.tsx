"use client";

import React, { useEffect, useState } from "react";
import RiwayatPage from "@/containers/mahasiswa/tugas-akhir-page/riwayat-page";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { api } from "@/utils/api";
import { FPChangeLecturer } from "@/types/mahasiswa";

export default function RiwayatPageComponent() {
  const { user, isLoading } = useAuth();

  // API CALL
  const getLecturer = async (): Promise<any> => {
    try {
      const response = await api.get("/mahasiswa/tugas-akhir/dosen");
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      throw error;
    }
  };

  const getFinalProjectHistory = async (): Promise<any> => {
    try {
      if (!isLoading && user) {
        const response = await api.get(
          `/mahasiswa/tugas-akhir/riwayat/${user.id}`
        );
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error("Error fetching final project history:", error);
      throw error;
    }
  };

  const onChangeSupervisor = async (data: FPChangeLecturer) => {
    try {
      const response = await api.post(
        "/mahasiswa/tugas-akhir/ganti-dosen",
        data
      );
      return response;
    } catch (error) {
      console.error("Error changing lecturer:", error);
      throw error;
    }
  };

  const onDeleteFinalProject = async (fpId: number) => {
    try {
      const response = await api.delete(`/mahasiswa/tugas-akhir/hapus/${fpId}`);
      return response;
    } catch (error) {
      console.error("Error deleting final project:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <RiwayatPage
      getLecturer={getLecturer}
      getFinalProjectHistory={getFinalProjectHistory}
      onChangeSupervisor={onChangeSupervisor}
      onDeleteFinalProject={onDeleteFinalProject}
    />
  );
}
