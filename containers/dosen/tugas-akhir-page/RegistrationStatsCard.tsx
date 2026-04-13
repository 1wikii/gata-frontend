"use client";

import React from "react";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import { StudentData } from "./BimbinganTable";

interface RegistrationStatsCardProps {
  validationData: StudentData[];
}

const RegistrationStatsCard: React.FC<RegistrationStatsCardProps> = ({
  validationData,
}) => {
  // Calculate statistics
  const totalRegistrations = validationData.length;
  const approvedCount = validationData.filter(
    (item) => item.supervisor_status === "approved"
  ).length;
  const pendingCount = validationData.filter(
    (item) => item.supervisor_status === "pending"
  ).length;
  const rejectedCount = validationData.filter(
    (item) => item.supervisor_status === "rejected"
  ).length;

  // Count by type
  const regularCount = validationData.filter(
    (item) => item.type === "regular"
  ).length;
  const capstoneCount = validationData.filter(
    (item) => item.type === "capstone"
  ).length;

  // Calculate approval percentage
  const approvalPercentage =
    totalRegistrations > 0
      ? Math.round((approvedCount / totalRegistrations) * 100)
      : 0;

  const pendingPercentage =
    totalRegistrations > 0
      ? Math.round((pendingCount / totalRegistrations) * 100)
      : 0;

  const rejectedPercentage =
    totalRegistrations > 0
      ? Math.round((rejectedCount / totalRegistrations) * 100)
      : 0;

  return (
    <div className="content-section w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          📊 Statistik Pendaftar Tugas Akhir
        </h2>
        <p className="text-sm text-gray-600">
          Ringkasan lengkap data pendaftar bimbingan tugas akhir Anda
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Registrations */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Pendaftar</p>
          <p className="text-3xl font-bold text-blue-600">
            {totalRegistrations}
          </p>
          <p className="text-xs text-blue-600 mt-3">
            {totalRegistrations > 0
              ? "✓ Ada pendaftar baru"
              : "Belum ada pendaftar"}
          </p>
        </div>

        {/* Approved */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full">
              {approvalPercentage}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Disetujui</p>
          <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          <div className="w-full bg-gray-300 rounded-full h-1.5 mt-3">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${approvalPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
              {pendingPercentage}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Menunggu Persetujuan</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          <div className="w-full bg-gray-300 rounded-full h-1.5 mt-3">
            <div
              className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${pendingPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded-full">
              {rejectedPercentage}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Ditolak</p>
          <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          <div className="w-full bg-gray-300 rounded-full h-1.5 mt-3">
            <div
              className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${rejectedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* By Type */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Jenis Tugas Akhir</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Reguler</p>
                <p className="text-xs text-gray-500">Mandiri</p>
              </div>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                {regularCount}
              </span>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Capstone</p>
                <p className="text-xs text-gray-500">Berkelompok</p>
              </div>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                {capstoneCount}
              </span>
            </div>
          </div>
        </div>

        {/* Supervisor Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pilihan Pembimbing</h3>
          </div>
          <div className="space-y-3">
            {(() => {
              const sup1Count = validationData.filter(
                (item) => item.supervisor_choices === "1"
              ).length;
              const sup2Count = validationData.filter(
                (item) => item.supervisor_choices === "2"
              ).length;
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Pembimbing 1
                      </p>
                      <p className="text-xs text-gray-500">Pilihan utama</p>
                    </div>
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {sup1Count}
                    </span>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Pembimbing 2
                      </p>
                      <p className="text-xs text-gray-500">
                        Pilihan alternatif
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-cyan-100 text-cyan-700 font-bold text-sm">
                      {sup2Count}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Quick Insights</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold mt-0.5">→</span>
              <p className="text-gray-700">
                <strong className="text-indigo-700">
                  {((approvedCount / totalRegistrations) * 100).toFixed(0)}%
                </strong>{" "}
                tingkat approval
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold mt-0.5">→</span>
              <p className="text-gray-700">
                <strong className="text-indigo-700">{pendingCount}</strong>{" "}
                perlu tindakan
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold mt-0.5">→</span>
              <p className="text-gray-700">
                {totalRegistrations > 0
                  ? `Total ${totalRegistrations} mahasiswa terdaftar`
                  : "Belum ada pendaftar"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Perincian Status</h3>
        <div className="space-y-3">
          {/* Approved breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Disetujui
              </span>
              <span className="text-sm font-bold text-gray-900">
                {approvedCount} ({approvalPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${approvalPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Pending breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Menunggu
              </span>
              <span className="text-sm font-bold text-gray-900">
                {pendingCount} ({pendingPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Rejected breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Ditolak
              </span>
              <span className="text-sm font-bold text-gray-900">
                {rejectedCount} ({rejectedPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rejectedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStatsCard;
