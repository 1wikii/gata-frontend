"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader,
  Info,
} from "lucide-react";
import { dosenDashboardApi } from "@/utils/dosenDashboardApi";
import {
  DosenStats,
  UpcomingSchedule,
  GuidedStudentSummary,
  Announcement,
} from "@/types/dosen-dashboard";

const DosenDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DosenStats | null>(null);
  const [schedules, setSchedules] = useState<UpcomingSchedule[]>([]);
  const [studentsSummary, setStudentsSummary] = useState<
    GuidedStudentSummary[]
  >([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dosenName, setDosenName] = useState("Dr. Budi Santoso");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile first to get dosen name
        const profileData = await dosenDashboardApi.getDosenProfile();
        if (profileData.name) {
          setDosenName(profileData.name);
        }

        // Fetch all dashboard data
        const dashboardData = await dosenDashboardApi.getDashboardData();

        if (dashboardData.stats) {
          setStats(dashboardData.stats);
        }

        if (dashboardData.upcomingSchedules) {
          setSchedules(dashboardData.upcomingSchedules);
        }

        if (dashboardData.guidedStudentsSummary) {
          setStudentsSummary(dashboardData.guidedStudentsSummary);
        }

        if (dashboardData.announcements) {
          setAnnouncements(dashboardData.announcements);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dashboard. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-red-50 border-red-200">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-sm text-red-800 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Coba Lagi
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image Section */}
      <div className="relative w-full h-[280px] md:h-[320px] lg:h-[360px]">
        <Image
          src="/images/dashboard-mahasiswa.svg"
          alt="Dashboard Dosen"
          fill
          style={{ objectFit: "cover" }}
          className="z-0"
          priority
        />
        {/* Overlay untuk kontras teks */}
        <div className="absolute inset-0 bg-black/20 z-1"></div>

        {/* Welcome Section */}
        <div className="bg-gray-800/50 absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Selamat Datang, {dosenName}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Kelola bimbingan mahasiswa, jadwal sidang, dan pantau progress tugas
            akhir dengan mudah
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Section - Jadwal Sidang */}
          <div className="xl:col-span-2">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">
                    Jadwal Sidang Mendatang
                  </CardTitle>
                  <Badge variant="default" className="bg-blue-500">
                    {schedules.length} Terjadwal
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Sidang yang harus Anda hadiri sebagai penguji atau pembimbing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedules.length > 0 ? (
                    <>
                      {schedules.map((schedule, index) => {
                        const borderColor =
                          schedule.jenisSidang === "proposal"
                            ? "border-l-4 border-blue-500 bg-blue-50"
                            : "border-l-4 border-green-500 bg-green-50";

                        const badgeColor =
                          schedule.jenisSidang === "proposal"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700";

                        const iconBgColor =
                          schedule.jenisSidang === "proposal"
                            ? "bg-blue-500"
                            : "bg-green-500";

                        return (
                          <div
                            key={schedule.id || index}
                            className={`flex items-start space-x-4 p-4 ${borderColor} rounded-xl hover:shadow-md transition-shadow`}
                          >
                            <div
                              className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {schedule.studentName}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={badgeColor}
                                >
                                  {schedule.jenisSidang === "proposal"
                                    ? "Proposal"
                                    : "Hasil"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Pembimbing: {schedule.supervisor}
                              </p>
                              <p className="text-sm text-gray-700 font-medium mt-1">
                                {schedule.title}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>📅 {schedule.date}</span>
                                <span>
                                  🕙 {schedule.time} - {schedule.endTime} WIB
                                </span>
                              </div>
                              <Badge variant="outline" className="mt-2 text-xs">
                                Ruang: {schedule.room}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-center pt-2">
                        <a
                          href="#"
                          className="flex items-center gap-2 text-center font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Lihat Semua Jadwal Sidang →
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <p>Tidak ada jadwal sidang mendatang</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Info Cards */}
          <div className="space-y-6">
            {/* Pengumuman Terbaru */}
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Pengumuman Penting
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Informasi akademik terbaru
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {announcements.length > 0 ? (
                  announcements.map((announcement, index) => {
                    // Determine colors based on priority
                    const priorityColors = {
                      high: {
                        bgColor: "bg-blue-50",
                        borderColor: "border-l-4 border-blue-500",
                        badgeBg: "bg-blue-100 text-blue-800",
                        iconBgColor: "bg-blue-100",
                        iconColor: "text-blue-600",
                        Icon: Info,
                      },
                      low: {
                        bgColor: "bg-gray-50",
                        borderColor: "border-l-4 border-gray-500",
                        badgeBg: "bg-gray-100 text-gray-800",
                        iconBgColor: "bg-gray-100",
                        iconColor: "text-gray-600",
                        Icon: Calendar,
                      },
                    };

                    const colors =
                      priorityColors[
                        announcement.priority as keyof typeof priorityColors
                      ] || priorityColors.low;
                    const Icon = colors.Icon;

                    // Format date
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      return new Intl.DateTimeFormat("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(date);
                    };

                    return (
                      <div
                        key={announcement.id}
                        className={`${colors.bgColor} ${colors.borderColor} p-4 transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`w-10 h-10 ${colors.iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title & Badge */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                {announcement.title}
                              </h3>
                              <Badge
                                className={`${colors.badgeBg} text-xs font-semibold flex-shrink-0`}
                              >
                                {announcement.priority === "high"
                                  ? "Penting"
                                  : "Infomasi"}
                              </Badge>
                            </div>

                            {/* Content Text */}
                            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                              {announcement.content}
                            </p>

                            {/* Footer with date and status */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-gray-500">
                                📅 {formatDate(announcement.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Tidak ada pengumuman</p>
                    <p className="text-xs text-gray-400">
                      Silakan cek kembali nanti
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosenDashboard;
