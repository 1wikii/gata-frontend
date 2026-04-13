"use client";
import React from "react";
import PengajuanPage from "@/containers/admin/tugas-akhir-page/pengajuan-page";
import { api } from "@/utils/api";
import { FPApprovalRequest } from "@/types/admin";

export default function TugasAkhirPengajuan() {
  // API CALL
  const getData = async (): Promise<any> => {
    try {
      const response = await api.get(`/admin/tugas-akhir/pengajuan`);
      return response;
    } catch (error) {
      console.error("Error approving final project:", error);
      throw error;
    }
  };

  // onApproval
  const onApproval = async (data: any): Promise<any> => {
    try {
      const response = await api.post(`/admin/tugas-akhir/persetujuan`, data);
      return response;
    } catch (error) {
      console.error("Error approving final project:", error);
      throw error;
    }
  };
  return <PengajuanPage getData={getData} onApproval={onApproval} />;
}
