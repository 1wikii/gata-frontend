"use client";

import React from "react";
import { Clock, User, Users, BookOpen } from "lucide-react";
import { SidangScheduleRow, parseDate } from "@/utils/sidangScheduleParser";

interface SidangScheduleTableProps {
  schedules: SidangScheduleRow[];
  onEdit?: (schedule: SidangScheduleRow) => void;
  onDelete?: (scheduleId: number) => void;
}

const SidangScheduleTable: React.FC<SidangScheduleTableProps> = ({
  schedules,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-max border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 sticky top-0 z-10">
            <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              AKSI
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              TANGGAL
            </th>
            <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              MULAI
            </th>
            <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              SELESAI
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              NIM
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              NAMA
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              JUDUL
            </th>
            <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              TYPE
            </th>
            <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              CAPSTONE
            </th>
            <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              LOKASI
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              PEMBIMBING 1
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              PEMBIMBING 2
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              PENGUJI 1
            </th>
            <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap border-b-2 border-blue-700">
              PENGUJI 2
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {schedules.map((schedule, index) => (
            <tr
              key={`${schedule.nim}-${index}`}
              className={`border-b transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50`}
            >
              {/* AKSI */}
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit?.(schedule)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(schedule.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-medium transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </td>

              {/* TANGGAL */}
              <td className="px-4 py-3 text-sm font-mono text-gray-900 whitespace-nowrap">
                {schedule.date}
              </td>

              {/* MULAI */}
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-center font-mono">
                {schedule.startTime}
              </td>

              {/* SELESAI */}
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-center font-mono">
                {schedule.endTime}
              </td>

              {/* NIM */}
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap font-mono">
                {schedule.nim}
              </td>

              {/* NAMA */}
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap font-medium min-w-[180px]">
                {schedule.name}
              </td>

              {/* JUDUL */}
              <td className="px-4 py-3 text-sm text-gray-700 max-w-[300px]">
                <div className="line-clamp-2" title={schedule.judul}>
                  {schedule.judul || "-"}
                </div>
              </td>

              {/* TYPE */}
              <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${
                    schedule.type.toLowerCase().includes("proposal")
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {schedule.type === "proposal" ? "Proposal" : "Sidang"}
                </span>
              </td>

              {/* CAPSTONE */}
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-center font-medium">
                {schedule.capstone_code ? (
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                    {schedule.capstone_code.split(" ")[0] || "-"}
                  </span>
                ) : (
                  "-"
                )}
              </td>

              {/* LOKASI */}
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-center font-medium">
                <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                  {schedule.location || "-"}
                </span>
              </td>

              {/* PEMBIMBING 1 */}
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                {schedule.spv_1 || "-"}
              </td>

              {/* PEMBIMBING 2 */}
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                {schedule.spv_2 || "-"}
              </td>

              {/* PENGUJI 1 */}
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                {schedule.examiner_1 || "-"}
              </td>

              {/* PENGUJI 2 */}
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap min-w-[150px]">
                {schedule.examiner_2 || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SidangScheduleTable;
