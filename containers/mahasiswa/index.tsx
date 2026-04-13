"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import StatsCard from "@/components/cards/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getMahasiswaDashboard,
  getUpcomingActivities,
  getRecentAnnouncements,
} from "@/utils/mahasiswaDashboardApi";
import {
  StudentProfile,
  GuidanceProgress,
  FinalProjectTimeline,
  UpcomingActivity,
  Announcement,
} from "@/types/mahasiswa-dashboard";
import { AlertCircle, Loader2 } from "lucide-react";

const MahasiswaDashboard: React.FC = () => {
  // State
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [guidanceProgress, setGuidanceProgress] = useState<GuidanceProgress[]>(
    []
  );
  const [timeline, setTimeline] = useState<FinalProjectTimeline[]>([]);
  const [upcomingActivities, setUpcomingActivities] = useState<
    UpcomingActivity[]
  >([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch main dashboard data
        const dashboardResponse = await getMahasiswaDashboard();
        const dashboardData = dashboardResponse.data;

        setProfile(dashboardData.profile);
        setGuidanceProgress(dashboardData.guidance_progress);
        setTimeline(dashboardData.timeline);

        // Fetch upcoming activities
        const activitiesResponse = await getUpcomingActivities(7, 5);
        setUpcomingActivities(activitiesResponse.data);

        // Fetch recent announcements
        const announcementsResponse = await getRecentAnnouncements(3);
        setAnnouncements(announcementsResponse.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Gagal memuat data dashboard. Silakan coba lagi nanti atau hubungi administrator."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date to Indonesian locale
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string): number => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status color for timeline
  const getStatusColor = (
    status: "completed" | "in_progress" | "not_started" | "cancelled"
  ) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-50",
          border: "border-green-500",
          icon: "text-white",
        };
      case "in_progress":
        return {
          bg: "bg-blue-50",
          border: "border-blue-500",
          icon: "text-white",
        };
      case "not_started":
        return {
          bg: "bg-gray-50",
          border: "border-gray-300",
          icon: "text-white",
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          border: "border-red-300",
          icon: "text-white",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-300",
          icon: "text-white",
        };
    }
  };

  // Get status icon
  const getStatusIcon = (
    status: "completed" | "in_progress" | "not_started" | "cancelled"
  ) => {
    switch (status) {
      case "completed":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "in_progress":
        return (
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        );
      default:
        return <div className="w-3 h-3 bg-white rounded-full"></div>;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "not_started":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get progress bar color
  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-orange-500";
  };

  // Get progress text color
  const getProgressTextColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-blue-600";
    if (percentage >= 25) return "text-yellow-600";
    return "text-orange-600";
  };

  // Get urgency badge color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // Get announcement priority color
  const getAnnouncementPriorityColor = (priority: string) => {
    return priority === "high"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="bg-red-50 border-red-200 max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Terjadi Kesalahan
                </h3>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Coba Lagi
                </button>
              </div>
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
          alt="Institut Teknologi Sumatera Gate"
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
            Selamat Datang, {profile?.name || "Mahasiswa"}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Pantau progress tugas akhir Anda dan tetap update dengan informasi
            akademik terbaru
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bimbingan Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Progress Bimbingan
            </h2>
            <p className="text-gray-600">
              Pantau kemajuan bimbingan dengan dosen pembimbing Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guidanceProgress.length > 0 ? (
              <>
                {guidanceProgress.map((progress) => (
                  <Card
                    key={progress.supervisor_id}
                    className="bg-white shadow-lg border-0"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-gray-900">
                          Dosen Pembimbing
                        </CardTitle>
                        <Badge
                          variant="default"
                          className={
                            progress.status === "active"
                              ? "bg-green-500"
                              : progress.status === "waiting"
                              ? "bg-orange-500"
                              : "bg-gray-500"
                          }
                        >
                          {progress.status === "active"
                            ? "Aktif"
                            : progress.status === "waiting"
                            ? "Menunggu"
                            : "Tidak Aktif"}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600">
                        {progress.supervisor.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span
                              className={`text-3xl font-bold ${getProgressTextColor(
                                Math.min(progress.progress_percentage, 100)
                              )}`}
                            >
                              {progress.completed_sessions}
                            </span>
                            <span className="text-xs text-gray-500 block mt-1">
                              dari {progress.total_sessions} sesi
                            </span>
                          </div>
                          <span
                            className={`text-2xl font-bold ${getProgressTextColor(
                              Math.min(progress.progress_percentage, 100)
                            )}`}
                          >
                            {Math.min(
                              progress.progress_percentage,
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`${getProgressBarColor(
                              Math.min(progress.progress_percentage, 100)
                            )} h-3 rounded-full transition-all duration-300`}
                            style={{
                              width: `${Math.min(
                                progress.progress_percentage,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <div className="text-xs text-gray-600">
                          {progress.last_session_date
                            ? `Terakhir: ${formatDate(
                                progress.last_session_date
                              )}`
                            : "Belum ada sesi bimbingan"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="bg-gray-50 border-gray-200 col-span-full">
                <CardContent className="pt-6 pb-6">
                  <p className="text-center text-gray-600 py-4">
                    Belum ada data bimbingan
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Section - Status Tugas Akhir */}
          <div className="xl:col-span-2">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">
                    Status Tugas Akhir
                  </CardTitle>
                  <Badge variant="default" className="bg-blue-500">
                    Sedang Berjalan
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Timeline dan milestone progress tugas akhir Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {timeline.length > 0 ? (
                  <div className="space-y-6">
                    {timeline.map((item) => {
                      const colors = getStatusColor(item.status);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-start space-x-4 p-4 ${colors.bg} rounded-xl border-l-4 ${colors.border}`}
                        >
                          <div
                            className={`w-8 h-8 ${
                              item.status === "completed"
                                ? "bg-green-500"
                                : item.status === "in_progress"
                                ? "bg-blue-500"
                                : item.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-gray-300"
                            } rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                          >
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">
                                {item.milestone}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={getStatusBadgeColor(item.status)}
                              >
                                {item.status === "completed"
                                  ? "Selesai"
                                  : item.status === "in_progress"
                                  ? "Sedang Berjalan"
                                  : item.status === "cancelled"
                                  ? "Dibatalkan"
                                  : "Belum Dimulai"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {item.status === "completed"
                                ? `Diselesaikan pada ${formatDate(
                                    item.completed_date || item.due_date
                                  )}`
                                : `Target: ${formatDate(item.due_date)}`}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">
                    Belum ada data timeline
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Info Cards */}
          <div className="space-y-6">
            {/* Jadwal Mendatang */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Jadwal Mendatang
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Agenda penting minggu ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingActivities.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingActivities.slice(0, 2).map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-lg border ${
                          activity.urgency === "high"
                            ? "bg-red-50 border-red-200"
                            : activity.urgency === "medium"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {activity.title}
                            </p>
                            {activity.supervisor && (
                              <p className="text-sm text-gray-600">
                                {activity.supervisor.name}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="default"
                            className={
                              activity.days_until === 0
                                ? "bg-red-500"
                                : activity.days_until <= 3
                                ? "bg-orange-500"
                                : "bg-blue-500"
                            }
                          >
                            {activity.days_until === 0
                              ? "Hari Ini"
                              : activity.days_until === 1
                              ? "Besok"
                              : `${activity.days_until} hari`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          📅 {formatDate(activity.scheduled_date)}
                        </p>
                        {activity.scheduled_time && (
                          <p className="text-sm text-gray-600">
                            🕙 {activity.scheduled_time}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-4">
                    Tidak ada jadwal mendatang
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Berita Terbaru */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Berita Terbaru
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Pengumuman dan informasi akademik
                </CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            announcement.priority === "high"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              announcement.priority === "high"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {announcement.category === "akademik"
                              ? "📢"
                              : announcement.category === "workshop"
                              ? "🎓"
                              : "⚠️"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-tight">
                            {announcement.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {announcement.content}
                          </p>
                          <Badge
                            variant="outline"
                            className={`mt-2 text-xs ${getAnnouncementPriorityColor(
                              announcement.priority
                            )}`}
                          >
                            {announcement.priority === "high"
                              ? "Penting"
                              : "Informasi"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-4">
                    Tidak ada pengumuman terbaru
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MahasiswaDashboard;
