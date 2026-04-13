"use client";
import React, { useEffect, useState } from "react";
import Periode from "@/containers/admin/tugas-akhir-page/daftar-page";
import { api } from "@/utils/api";
import Loading from "@/components/ui/loading";
import ErrorOnPeriod from "@/components/ui/error/admin-final-project-period";

export default function TugasAkhirPeriode() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnPeriod, setIsOnPeriod] = useState(true);

  // API CALL
  const handleSubmit = async (formData: any): Promise<any> => {
    try {
      const response = await api.post("/admin/tugas-akhir/periode", formData);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error during submit:", error);
    }
  };

  const handleFirstLoad = async (): Promise<any> => {
    try {
      const response = await api.get("/admin/tugas-akhir/periode");
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

  if (isOnPeriod) {
    return <ErrorOnPeriod />;
  }

  return <>{!isOnPeriod && <Periode onSubmit={handleSubmit} />}</>;
}
