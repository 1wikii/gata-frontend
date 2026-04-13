"use client";
import React from "react";

import MonitoringDashboard from "@/containers/dosen/bimbingan-page";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import Loading from "@/components/ui/loading";
import { JadwalBimbingan } from "@/types/bimbingan";

export default function Dashboard() {
  const { user } = useAuth();
  // API CALL
  const getDashboardData = async (): Promise<any> => {
    try {
      if (user) {
        const response = await api.get(`/dosen/bimbingan/dashboard/${user.id}`);
        return response;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleAction = async (data: Partial<JadwalBimbingan>): Promise<any> => {
    try {
      if (user) {
        const response = await api.post(`/dosen/bimbingan/action`, data);
        return response;
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  if (!user) {
    return <Loading />;
  }
  return (
    <MonitoringDashboard getData={getDashboardData} onAction={handleAction} />
  );
}
