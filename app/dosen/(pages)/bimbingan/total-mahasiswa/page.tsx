"use client";
import React from "react";
import TotalMahasiswaPageComponent from "@/containers/dosen/bimbingan-page/total-mahasiswa-page";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import Loading from "@/components/ui/loading";

export default function TotalMahasiswaPage() {
  const { user } = useAuth();

  const getDashboardData = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(
          `/dosen/bimbingan/total-mahasiswa/${user.id}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return <TotalMahasiswaPageComponent getData={getDashboardData} />;
}
