"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PengajuanBimbinganData } from "@/types/bimbingan-mahasiswa";
import { getDayName } from "@/utils/dateHelper";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  MapPin,
  BookOpen,
  FileText,
  ChevronRight,
  Plus,
} from "lucide-react";

interface Props {
  getData: () => Promise<any>;
}

const BimbinganPage: React.FC<Props> = ({ getData }) => {
  const [submissions, setSubmissions] = useState<PengajuanBimbinganData[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<PengajuanBimbinganData | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getData();
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSubmissions = submissions.length;
    const terjadwalCount = submissions.filter(
      (s) => s.status === "scheduled"
    ).length;
    const berlangsungCount = submissions.filter(
      (s) => s.status === "ongoing"
    ).length;
    const selesaiCount = submissions.filter(
      (s) => s.status === "completed"
    ).length;
    const dibatalkanCount = submissions.filter(
      (s) => s.status === "cancelled"
    ).length;
    const tidakHadirCount = submissions.filter(
      (s) => s.status === "no_show"
    ).length;

    return {
      totalSubmissions,
      terjadwalCount,
      berlangsungCount,
      selesaiCount,
      dibatalkanCount,
      tidakHadirCount,
    };
  }, [submissions]);

  // Group submissions by status
  const submissionsByStatus = useMemo(() => {
    const grouped: { [key: string]: PengajuanBimbinganData[] } = {
      scheduled: [],
      ongoing: [],
      completed: [],
      cancelled: [],
      no_show: [],
    };

    submissions.forEach((submission) => {
      grouped[submission.status]?.push(submission);
    });

    return grouped;
  }, [submissions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          bg: "bg-blue-50",
          border: "border-l-4 border-l-blue-500",
          icon: Calendar,
          label: "Terjadwal",
          badgeBg: "bg-blue-100",
          badgeText: "text-blue-700",
        };
      case "ongoing":
        return {
          bg: "bg-purple-50",
          border: "border-l-4 border-l-purple-500",
          icon: Clock,
          label: "Berlangsung",
          badgeBg: "bg-purple-100",
          badgeText: "text-purple-700",
        };
      case "completed":
        return {
          bg: "bg-green-50",
          border: "border-l-4 border-l-green-500",
          icon: CheckCircle,
          label: "Selesai",
          badgeBg: "bg-green-100",
          badgeText: "text-green-700",
        };
      case "cancelled":
        return {
          bg: "bg-orange-50",
          border: "border-l-4 border-l-orange-500",
          icon: AlertCircle,
          label: "Dibatalkan",
          badgeBg: "bg-orange-100",
          badgeText: "text-orange-700",
        };
      case "no_show":
        return {
          bg: "bg-red-50",
          border: "border-l-4 border-l-red-500",
          icon: XCircle,
          label: "Tidak Hadir",
          badgeBg: "bg-red-100",
          badgeText: "text-red-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-l-4 border-l-gray-500",
          icon: AlertCircle,
          label: "Unknown",
          badgeBg: "bg-gray-100",
          badgeText: "text-gray-700",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (jamMulai: string, jamSelesai: string) => {
    const [startHour, startMin] = jamMulai.split(":").map(Number);
    const [endHour, endMin] = jamSelesai.split(":").map(Number);
    const durationMin = endHour * 60 + endMin - (startHour * 60 + startMin);
    const hours = Math.floor(durationMin / 60);
    const mins = durationMin % 60;
    return hours > 0
      ? `${hours} jam ${mins > 0 ? mins + " menit" : ""}`
      : `${mins} menit`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pengajuan Bimbingan Tugas Akhir
            </h1>
            <p className="text-gray-600">
              Pantau status pengajuan bimbingan Anda dengan dosen pembimbing
            </p>
          </div>

          {/* Buat Pengajuan Button */}
          <a
            href={`/mahasiswa/bimbingan/pengajuan`}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Buat Pengajuan
          </a>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Pengajuan
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalSubmissions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Terjadwal</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.terjadwalCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Berlangsung
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.berlangsungCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.selesaiCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Dibatalkan / Tidak Hadir
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.dibatalkanCount + stats.tidakHadirCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions by Status */}
        <div className="space-y-6">
          {Object.entries(submissionsByStatus).map(
            ([status, statusSubmissions]) => (
              <div key={status}>
                {/* Status Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-1 bg-gradient-to-r from-primary to-blue-300 rounded-full"></div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {getStatusColor(status).label}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({statusSubmissions.length})
                    </span>
                  </h2>
                  <div className="flex-1 h-1 bg-gradient-to-l from-primary to-blue-300 rounded-full"></div>
                </div>

                {statusSubmissions.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {statusSubmissions.map((submission) => {
                      const statusColor = getStatusColor(submission.status);
                      const StatusIcon = statusColor.icon;

                      return (
                        <Card
                          key={submission.id}
                          className={`${
                            statusColor.border
                          } hover:shadow-lg transition-all duration-300 cursor-pointer ${
                            expandedId === submission.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() =>
                            setExpandedId(
                              expandedId === submission.id
                                ? null
                                : submission.id
                            )
                          }
                        >
                          <CardContent className="p-4">
                            {/* Header with Status */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${statusColor.badgeBg}`}
                                >
                                  <StatusIcon
                                    className={`w-5 h-5 ${statusColor.badgeText}`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-xs font-bold uppercase tracking-wide ${statusColor.badgeText}`}
                                  >
                                    {statusColor.label}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    {formatDate(submission.session_date)}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  expandedId === submission.id
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                            </div>

                            {/* Dosen Info */}
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                              <User className="w-4 h-4 text-gray-500" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                  Dosen Pembimbing
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {submission.lecture_name}
                                </p>
                              </div>
                            </div>

                            {/* Main Info */}
                            <div className="space-y-2 mb-3">
                              {/* Topic */}
                              <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">
                                    Topik Bimbingan
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {submission.topic}
                                  </p>
                                </div>
                              </div>

                              {/* Time and Location */}
                              <div className="flex gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Waktu
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {submission.start_time.slice(0, 5)} -{" "}
                                      {submission.end_time.slice(0, 5)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {calculateDuration(
                                        submission.start_time,
                                        submission.end_time
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Lokasi
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {submission.location}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === submission.id && (
                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                {/* Day Info */}
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <p className="text-sm text-gray-700">
                                    <span className="font-semibold">
                                      {getDayName(submission.day_of_week)}
                                    </span>
                                  </p>
                                </div>

                                {/* Draft Links */}
                                {submission.draftLinks &&
                                  submission.draftLinks.length > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <p className="text-xs font-semibold text-blue-900 mb-2">
                                        📎 Draft yang Dibagikan (
                                        {submission.draftLinks.length})
                                      </p>
                                      <div className="space-y-1">
                                        {submission.draftLinks.map(
                                          (link, idx) => (
                                            <a
                                              key={idx}
                                              href={link.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-blue-600 hover:text-blue-700 hover:underline block truncate"
                                            >
                                              • {link.name}
                                            </a>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Catatan Dosen */}
                                {submission.lecturer_feedback && (
                                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                                    <p className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                                      <AlertCircle className="w-4 h-4" />
                                      Catatan dari Dosen
                                    </p>
                                    <p className="text-sm text-amber-800 leading-relaxed">
                                      {submission.lecturer_feedback}
                                    </p>
                                  </div>
                                )}

                                {/* Created At */}
                                <p className="text-xs text-gray-500 pt-2">
                                  Diajukan pada{" "}
                                  {new Date(
                                    submission.created_at
                                  ).toLocaleString("id-ID")}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-dashed border-2">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Belum ada pengajuan{" "}
                        {getStatusColor(status).label.toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Mulai dengan membuat pengajuan baru
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          )}
        </div>

        {/* Empty State */}
        {submissions.length === 0 && (
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Belum Ada Pengajuan
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai perjalanan bimbingan Anda dengan membuat pengajuan pertama
              </p>
              <a
                href={`/mahasiswa/bimbingan/pengajuan`}
                className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Buat Pengajuan Pertama
              </a>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">
                  Penjelasan Status Pengajuan:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs">
                  <li>
                    <span className="font-semibold">Terjadwal:</span> Pengajuan
                    telah diterima dan jadwal bimbingan terkonfirmasi
                  </li>
                  <li>
                    <span className="font-semibold">Berlangsung:</span> Sesi
                    bimbingan sedang dilaksanakan
                  </li>
                  <li>
                    <span className="font-semibold">Selesai:</span> Sesi
                    bimbingan telah selesai dengan catatan dari dosen
                  </li>
                  <li>
                    <span className="font-semibold">Dibatalkan:</span> Sesi
                    dibatalkan oleh dosen dengan alasan tertentu
                  </li>
                  <li>
                    <span className="font-semibold">Tidak Hadir:</span> Anda
                    tidak hadir pada jadwal yang telah terjadwal
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BimbinganPage;
