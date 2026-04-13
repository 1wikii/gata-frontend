"use client";

import React from "react";

const StudentNotPeriod = () => {
  return (
    <div className="main-container w-4xl mx-auto flex flex-col items-center justify-center p-8">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
        <span className="text-white text-2xl font-bold">!</span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Pendaftaran Tugas Akhir Belum Dibuka Kembali
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center mb-8 max-w-xl">
        Maaf, periode pendaftaran tugas akhir saat ini belum dibuka. Silakan
        periksa informasi di bawah untuk mengetahui persyaratan dan dokumen yang
        diperlukan saat pendaftaran dibuka.
      </p>

      {/* Information Cards Container */}
      <div className="bg-gray-200 rounded-lg p-6 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Periode Pendaftaran */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Periode Pendaftaran
            </h3>
            <p className="text-gray-600 text-sm">
              Periode pendaftaran akan diumumkan melalui website GATA.
            </p>
          </div>

          {/* Persyaratan */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Persyaratan</h3>
            <div className="text-gray-600 text-sm">
              <p>Minimal 140 SKS</p>
              <p>Sudah mengambil mata kuliah metopen</p>
            </div>
          </div>
        </div>

        {/* Dokumen yang Diperlukan */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Dokumen yang Diperlukan
          </h3>
          <div className="text-gray-600 text-sm space-y-1">
            <p>Surat Dispensasi (Jika melakukan dispensasi)</p>
            <p>Draft tugas akhir (bab 1-3)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNotPeriod;
