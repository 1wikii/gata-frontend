"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { SidangScheduleRow, parseDate } from "@/utils/sidangScheduleParser";
import SidangScheduleItem from "./SidangScheduleItem";

interface SidangScheduleGroupProps {
  date: string;
  schedules: SidangScheduleRow[];
}

const SidangScheduleGroup: React.FC<SidangScheduleGroupProps> = ({
  date,
  schedules,
}) => {
  // Parse dan format tanggal untuk ditampilkan dengan urutan yang jelas
  const parsedDate = parseDate(date);
  const formatDateHeader = (
    dateStr: string
  ): { dateOnly: string; dayName: string } => {
    const parsed = parseDate(dateStr);
    if (!parsed) {
      return { dateOnly: dateStr, dayName: "" };
    }

    // Format tanggal: "15 September 2025"
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateOnly = parsed.toLocaleDateString("id-ID", options);

    // Ambil nama hari dari format asli
    const dayParts = dateStr.split(",");
    const dayName = dayParts.length > 0 ? dayParts[0].trim() : "";

    return { dateOnly, dayName };
  };

  const { dateOnly, dayName } = formatDateHeader(date);

  // Hitung statistik
  const proposalCount = schedules.filter((s) =>
    s.type.toLowerCase().includes("proposal")
  ).length;
  const sidangCount = schedules.filter(
    (s) => !s.type.toLowerCase().includes("proposal")
  ).length;

  // Ekstrak jam dari jadwal untuk range
  const times = schedules.map((s) => s.startTime);
  const minTime = times.length > 0 ? times.sort()[0] : "";
  const maxTime = times.length > 0 ? times.sort()[times.length - 1] : "";

  return (
    <div className="space-y-4">
      {/* Date Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 p-4 rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{dateOnly}</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">
                {dayName}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Clock className="w-4 h-4" />
                <span>
                  {minTime} - {maxTime}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="flex gap-2 flex-shrink-0">
            {proposalCount > 0 && (
              <div className="px-3 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                <span className="block">{proposalCount}</span>
                <span className="text-xs">Proposal</span>
              </div>
            )}
            {sidangCount > 0 && (
              <div className="px-3 py-2 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                <span className="block">{sidangCount}</span>
                <span className="text-xs">Sidang</span>
              </div>
            )}
            <div className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
              <span className="block">{schedules.length}</span>
              <span className="text-xs">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Items */}
      <div className="space-y-3 pl-0 md:pl-6">
        {schedules.map((schedule, index) => (
          <div key={`${schedule.nim}-${index}`}>
            <SidangScheduleItem schedule={schedule} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidangScheduleGroup;
