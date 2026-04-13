"use client";

import React from "react";
import BelumTerjadwalDisplay from "@/components/sidang/BelumTerjadwalDisplay";

const BelumTerjadwalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Data Belum Terjadwal
          </h1>
          <p className="text-gray-600 mt-2">
            Lihat data mahasiswa yang pengajuan sidangnya belum dijadwalkan.
          </p>
        </div>

        {/* Main Content */}
        <BelumTerjadwalDisplay />
      </div>
    </div>
  );
};

export default BelumTerjadwalPage;
