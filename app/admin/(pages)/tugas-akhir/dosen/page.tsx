"use client";
import React from "react";
import DosenPage from "@/containers/admin/tugas-akhir-page/dosen-page";
import { api } from "@/utils/api";

export default function TugasAkhirDosen() {
  // API CALL
  const getData = async (): Promise<any> => {
    try {
      const response = await api.get(`/admin/tugas-akhir/dosen`);
      return response;
    } catch (error) {
      console.error("Error approving final project:", error);
      throw error;
    }
  };

  // onApproval
  const onApproval = async (lcId: number): Promise<any> => {
    try {
      const response = await api.get(
        `/admin/tugas-akhir/persetujuan-batch/${lcId}`
      );
      return response;
    } catch (error) {
      console.error("Error approving final project:", error);
      throw error;
    }
  };
  return <DosenPage getData={getData} onApproval={onApproval} />;
}
