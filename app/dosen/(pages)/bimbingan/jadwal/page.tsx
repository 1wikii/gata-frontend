"use client";

import JadwalPage from "@/containers/dosen/bimbingan-page/jadwal-page";
import { KetersediaanDosen } from "@/types/ketersediaan";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { api } from "@/utils/api";

export default function Bimbingan() {
  const { user } = useAuth();

  // API CALL
  const getKetersediaan = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(
          `/dosen/bimbingan/ketersediaan/${user.id}`
        );

        return response;
      }
    } catch (error) {
      console.error("Error fetching ketersediaan:", error);
    }
  };

  const handleSave = async (data: KetersediaanDosen): Promise<any> => {
    try {
      if (user) {
        data.user_id = parseInt(user.id);

        const response = await api.post("/dosen/bimbingan/ketersediaan", data);

        return response;
      }
    } catch (error) {
      console.error("Error saving ketersediaan:", error);
    }
  };

  const handleDelete = async (id: number): Promise<any> => {
    try {
      if (user) {
        const response = await api.delete(
          `/dosen/bimbingan/ketersediaan/${id}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error deleting ketersediaan:", error);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <JadwalPage
      getKetersediaan={getKetersediaan}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
