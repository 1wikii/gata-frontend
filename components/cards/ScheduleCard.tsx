"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegCapBadge from "@/components/badges/RegCapBadge";
import StatusBimbinganBadge from "@/components/badges/StatusBimbinganBadge";
import { JadwalBimbingan } from "@/types/bimbingan";
import { getDayName } from "@/utils/dateHelper";
import {
  Clock,
  Calendar,
  Users,
  MapPin,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  CircleEllipsis,
} from "lucide-react";

interface ScheduleCardProps {
  schedule: JadwalBimbingan;
  onActionClick?: (e: React.MouseEvent) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onActionClick,
}) => {
  const {
    day_of_week,
    session_date,
    start_time,
    end_time,
    tipeTA,
    status,
    mahasiswa,
    location,
    topic,
    lecturer_feedback,
    draftLinks,
  } = schedule;

  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary overflow-auto group cursor-pointer"
      onClick={onActionClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Calendar className="w-4 h-4 text-primary" />
              <CardTitle className="text-lg font-bold text-gray-900">
                {getDayName(day_of_week)}
              </CardTitle>
              <RegCapBadge tipe={tipeTA} />
              <StatusBimbinganBadge status={status} />
            </div>
            <p className="text-sm text-gray-500">{formatDate(session_date)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Time */}
        <div className="flex items-center gap-2 text-gray-700">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {start_time.slice(0, 5)} - {end_time.slice(0, 5)}
            </p>
          </div>
        </div>

        {/* Room (if available) */}
        {location && (
          <div className="flex items-center gap-2 text-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{location}</p>
            </div>
          </div>
        )}

        {/* Topic (if available) */}
        {topic && (
          <div className="flex items-center gap-2 text-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{topic}</p>
            </div>
          </div>
        )}

        {/* Students */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 mt-0.5">
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Mahasiswa ({mahasiswa.length})
              </p>
              <div className="space-y-1.5">
                {mahasiswa.map((mhs) => (
                  <div
                    key={mhs.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {mhs.name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                      {mhs.nim}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Kehadiran & Catatan */}
        {(status ||
          lecturer_feedback ||
          (draftLinks && draftLinks.length > 0)) && (
          <div className="pt-2 border-t border-gray-100 space-y-3">
            {/* Status Kehadiran */}
            {/* {status && (
              <div className="flex items-center gap-2">
                {status === "completed" ? (
                  <>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700">
                      Sesi Selesai
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-red-700">
                      Mahasiswa Tidak Hadir
                    </span>
                  </>
                )}
              </div>
            )} */}

            {/* Draft Links */}
            {draftLinks && draftLinks.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 mt-0.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Draft Tugas Akhir ({draftLinks.length})
                  </p>
                  <div className="space-y-2">
                    {draftLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 group border border-blue-100 hover:border-blue-200"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-blue-200">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-900 truncate group-hover:text-blue-700">
                            {link.name}
                          </p>
                          {link.uploaded_at && (
                            <p className="text-xs text-blue-600 mt-0.5">
                              {new Date(link.uploaded_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          )}
                        </div>
                        <svg
                          className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Catatan */}
            {lecturer_feedback && (
              <div className="flex items-start gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 mt-0.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {status === "cancelled" ? "Alasan Pembatalan" : "Catatan"}
                  </p>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    {lecturer_feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
