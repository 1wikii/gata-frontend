"use client";

import React from "react";
import { Clock, User, BookOpen, Users } from "lucide-react";
import { SidangScheduleRow } from "@/utils/sidangScheduleParser";

interface SidangScheduleItemProps {
  schedule: SidangScheduleRow;
}

const SidangScheduleItem: React.FC<SidangScheduleItemProps> = ({
  schedule,
}) => {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("match")) return "bg-green-50 border-green-200";
    if (statusLower.includes("time")) return "bg-yellow-50 border-yellow-200";
    return "bg-gray-50 border-gray-200";
  };

  const getTypeBadgeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("proposal")) {
      return "bg-blue-100 text-blue-800 border-blue-300";
    }
    if (typeLower.includes("sidang")) {
      return "bg-purple-100 text-purple-800 border-purple-300";
    }
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div
      className={`p-4 rounded-lg border-l-4 border-l-blue-500 ${getStatusColor(
        schedule.status
      )} border transition-all hover:shadow-md`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Section - Informasi Utama */}
        <div className="flex-1 space-y-3">
          {/* Header dengan NIM dan Nama */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Mahasiswa
            </p>
            <p className="text-sm font-bold text-gray-900">{schedule.name}</p>
            <p className="text-xs text-gray-600 font-mono bg-white px-2 py-1 rounded inline-block mt-1">
              {schedule.nim}
            </p>
          </div>

          {/* Tipe dan Status */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(
                schedule.type
              )}`}
            >
              {schedule.type}
            </span>
            {schedule.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {schedule.status}
              </span>
            )}
          </div>

          {/* Waktu */}
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-medium">
              {schedule.startTime} - {schedule.endTime}
            </p>
          </div>

          {/* Fields/Keahlian */}
          {/* {(schedule.field_1 || schedule.field_2) && (
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Bidang Keahlian
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {schedule.field_1 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded border border-purple-200">
                      {schedule.field_1}
                    </span>
                  )}
                  {schedule.field_2 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded border border-purple-200">
                      {schedule.field_2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Right Section - Penguji dan Pembimbing */}
        <div className="flex-1 space-y-3 md:border-l md:border-gray-300 md:pl-4">
          {/* Pembimbing */}
          {(schedule.spv_1 || schedule.spv_2) && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Pembimbing
              </p>
              <div className="flex flex-wrap gap-2">
                {schedule.spv_1 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-gray-300 shadow-sm">
                    <User className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {schedule.spv_1}
                    </span>
                  </div>
                )}
                {schedule.spv_2 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-gray-300 shadow-sm">
                    <User className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {schedule.spv_2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Penguji */}
          {(schedule.examiner_1 || schedule.examiner_2) && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Penguji
              </p>
              <div className="flex flex-wrap gap-2">
                {schedule.examiner_1 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-gray-300 shadow-sm">
                    <Users className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {schedule.examiner_1}
                    </span>
                  </div>
                )}
                {schedule.examiner_2 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-gray-300 shadow-sm">
                    <Users className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {schedule.examiner_2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidangScheduleItem;
