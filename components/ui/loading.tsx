"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo/Icon Animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-2 bg-white rounded-full animate-pulse flex items-center justify-center">
            {/* Graduation cap icon */}
            <svg
              className="w-8 h-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
        </div>

        {/* Text Animation */}
        <div className="text-center space-y-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              GERBANG ADMINISTRASI
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-white/90">TUGAS AKHIR</h2>

          {/* Loading dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>

          <p className="text-white/80 text-sm mt-4 max-w-md">Memuat...</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 bg-white/20 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-white rounded-full animate-pulse"
            style={{
              animation: "progress 2s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
