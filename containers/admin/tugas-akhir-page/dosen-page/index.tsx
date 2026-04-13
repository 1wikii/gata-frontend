"use client";
import React, { useEffect, useState } from "react";
import DosenTable from "./dosen-table";
import Loading from "@/components/ui/loading";

interface Props {
  getData: () => Promise<any>;
  onApproval: (lcId: number) => Promise<any>;
}
const Dosen = ({ getData, onApproval }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
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
    <div className="content-section w-full">
      <h2 className="text-xl font-semibold text-primary mb-6">
        Data Ketersedian Dosen
      </h2>

      <DosenTable data={data} onApproval={onApproval} />
    </div>
  );
};
export default Dosen;
