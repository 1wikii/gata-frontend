"use client";

import React from "react";
import BimbinganPage from "@/containers/mahasiswa/bimbingan-page";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";

export default function Bimbingan() {
  const { user } = useAuth();
  // API CALL
  const getData = async () => {
    try {
      if (user) {
        const response = await api.get(
          `/mahasiswa/bimbingan/dashboard/${user.id}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return <BimbinganPage getData={getData} />;
}
