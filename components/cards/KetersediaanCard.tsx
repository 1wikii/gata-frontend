"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KetersediaanDosen } from "@/types/ketersediaan";
import { Clock, Pencil, Trash2 } from "lucide-react";

interface KetersediaanCardProps {
  ketersediaan: KetersediaanDosen;
  sessionNumber: number;
  onEdit: (ketersediaan: KetersediaanDosen) => void;
  onDelete: (id: number) => void;
}

const KetersediaanCard: React.FC<KetersediaanCardProps> = ({
  ketersediaan,
  sessionNumber,
  onEdit,
  onDelete,
}) => {
  const { id, day_of_week, start_time, end_time, location } = ketersediaan;

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary overflow-hidden group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Time Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Sesi {sessionNumber}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {start_time.slice(0, 5)} - {end_time.slice(0, 5)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {(() => {
                  const [startHour, startMin, startSec] = start_time
                    .split(":")
                    .map(Number);
                  const [endHour, endMin, endSec] = end_time
                    .split(":")
                    .map(Number);
                  const durationMin =
                    endHour * 60 + endMin - (startHour * 60 + startMin);
                  const hours = Math.floor(durationMin / 60);
                  const mins = durationMin % 60;
                  return hours > 0
                    ? `${hours} jam ${mins > 0 ? mins + " menit" : ""}`
                    : `${mins} menit`;
                })()}
              </p>
              {location && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md">
                  <svg
                    className="w-3.5 h-3.5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-blue-700">
                    {location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(ketersediaan)}
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KetersediaanCard;
