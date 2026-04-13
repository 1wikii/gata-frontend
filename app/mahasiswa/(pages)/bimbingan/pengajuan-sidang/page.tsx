"use client";

import React from "react";
import PengajuanSidangPage from "@/containers/mahasiswa/bimbingan-page/pengajuan-sidang-page";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import Loading from "@/components/ui/loading";
import { PengajuanSidangForm } from "@/types/pengajuan-sidang-mahasiswa";

export default function PengajuanSidang() {
  const { user } = useAuth();
  // fetching api code
  const getSupervisor = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(
          `/mahasiswa/bimbingan/pembimbing/${user.id}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error fetching supervisor:", error);
    }
  };

  const getFinalProjectMembers = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(
          `/mahasiswa/bimbingan/anggota-tugas-akhir/${user.id}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error fetching final project members:", error);
    }
  };

  const getExpertisesGroup = async (): Promise<any> => {
    try {
      const response = await api.get(`/mahasiswa/bimbingan/kelompok-keahlian`);
      return response;
    } catch (error) {
      console.error("Error fetching expertises group:", error);
    }
  };

  const handleSave = async (data: PengajuanSidangForm) => {
    try {
      const response = await api.post(
        `/mahasiswa/bimbingan/pengajuan-sidang`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <PengajuanSidangPage
      getSupervisor={getSupervisor}
      getExpertisesGroup={getExpertisesGroup}
      getFinalProjectMembers={getFinalProjectMembers}
      onSave={handleSave}
    />
  );
}
