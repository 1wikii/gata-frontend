"use client";
import React, { useEffect, useState } from "react";
import KuotaBimbinganCard from "./KuotaBimbinganCard";
import BimbinganTable from "./BimbinganTable";
import RegistrationStatsCard from "./RegistrationStatsCard";
import Loading from "@/components/ui/loading";
import { FPApprovalRequest } from "@/types/dosen";

interface props {
  isPeriod: boolean;
  getValidationStats: () => Promise<any>;
  getValidationData: () => Promise<any>;
  onApproval: (data: FPApprovalRequest) => Promise<any>;
  onAddSlot: (data: {
    supervisorType: "1" | "2";
    amount: number;
  }) => Promise<any>;
}

const TugasAkhirPage: React.FC<props> = ({
  isPeriod,
  getValidationStats,
  getValidationData,
  onApproval,
  onAddSlot,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [validationStats, setValidationStats] = useState<any>(null);
  const [validationData, setValidationData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getValidationStats();
        setValidationStats(stats.data);

        const data = await getValidationData();
        setValidationData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    validationData && (
      <div className="main-container w-full flex flex-col gap-y-4 items-center">
        <RegistrationStatsCard validationData={validationData} />

        <KuotaBimbinganCard
          validationData={validationStats}
          onAddSlot={onAddSlot}
        />

        <BimbinganTable
          isPeriod={isPeriod}
          validationData={validationData}
          onApproval={onApproval}
        />
      </div>
    )
  );
};

export default TugasAkhirPage;
