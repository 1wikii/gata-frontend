"use client";

import PengajuanBimbinganPage from "@/containers/mahasiswa/bimbingan-page/pengajuan-page";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { PengajuanBimbinganForm } from "@/types/bimbingan-mahasiswa";

export default function PengajuanBimbingan() {
  const { user } = useAuth();
  // API CALL
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

  const handleCreate = async (data: PengajuanBimbinganForm) => {
    try {
      const response = await api.post(`/mahasiswa/bimbingan/pengajuan`, data);
      return response;
    } catch (error) {
      console.error("Error creating submission:", error);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <PengajuanBimbinganPage
      getSupervisor={getSupervisor}
      onCreate={handleCreate}
    />
  );
}
