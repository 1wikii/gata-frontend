"use client";

import React from "react";

const AdminFinalProjectPeriod = () => {
  return (
    <div className="main-container w-4xl mx-auto flex flex-col items-center justify-center p-8">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
        <span className="text-white text-2xl font-bold">!</span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Periode Pendaftaran Tugas Akhir Masih Berlangsung
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center mb-8 max-w-xl">
        Maaf, periode pendaftaran tugas akhir untuk semester ini masih
        berlangsung. Silakan tunggu hingga periode pendaftaran berakhir untuk
        melakukan pengaturan lebih lanjut.
      </p>
    </div>
  );
};

export default AdminFinalProjectPeriod;
