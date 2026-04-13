"use client";

import React from "react";
import SidangScheduleDisplay from "@/components/sidang/SidangScheduleDisplay";

const SidangDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Jadwal Pelaksanaan Sidang
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola dan lihat jadwal pelaksanaan sidang proposal dan sidang akhir
            mahasiswa.
          </p>
        </div>

        {/* Main Content */}
        <SidangScheduleDisplay />
      </div>
    </div>
  );
};

export default SidangDashboard;
