"use client";

import React from "react";
import PengajuanSidangPage from "@/containers/dosen/bimbingan-page/pengajuan-sidang-page";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import Loading from "@/components/ui/loading";
import { PengajuanSidangApproval } from "@/types/pengajuan-sidang";

export default function PengajuanSidang() {
  const { user } = useAuth();

  // API CALL

  const getPengajuanSidang = async () => {
    try {
      if (user) {
        const response = await api.get(
          `/dosen/bimbingan/pengajuan-sidang/${user.id}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApproval = async (data: PengajuanSidangApproval) => {
    try {
      const response = await api.post(
        `/dosen/bimbingan/pengajuan-sidang/persetujuan`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  if (!user) {
    return <Loading />;
  }

  return (
    <PengajuanSidangPage
      getData={getPengajuanSidang}
      onApproval={handleApproval}
    />
  );
}
