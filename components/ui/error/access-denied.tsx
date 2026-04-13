"use client";

import React from "react";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-8 text-center max-w-md">
        {/* Error Icon */}
        <div className="relative">
          {/* Outer circle with pulse */}
          <div className="w-24 h-24 bg-red-500/20 rounded-full animate-pulse flex items-center justify-center">
            {/* Inner circle */}
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              {/* Lock icon */}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Warning triangle overlay */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white/90">403</h1>
          <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Akses Ditolak</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Anda tidak punya akses ke halaman ini
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Silakan hubungi administrator sistem atau pastikan Anda memiliki
            izin yang diperlukan untuk mengakses halaman ini.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
          <button
            onClick={() => window.history.back()}
            className="cursor-pointer flex-1 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </button>

          <button
            onClick={() =>
              (window.location.href = process.env.NEXT_PUBLIC_BASE_URL + "/")
            }
            className="cursor-pointer flex-1 bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Beranda
          </button>
        </div>

        {/* GATA Branding */}
        <div className="pt-8 border-t border-white/20 w-full">
          <p className="text-white/60 text-sm">
            GERBANG ADMINISTRASI TUGAS AKHIR
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
