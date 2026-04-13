"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAdminDashboardStats,
  getRecentAnnouncements,
  getSystemStatus,
  getPeriodeInfo,
  getDosenVerificationStatus,
  getJadwalSidangStatus,
  type DashboardStats,
  type Announcement,
  type SystemStatus as SystemStatusType,
  type PeriodeInfo,
  type DosenVerificationStatus,
  type JadwalSidangStatus,
} from "@/utils/adminDashboardApi";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatusType | null>(
    null
  );
  const [periodeInfo, setPeriodeInfo] = useState<PeriodeInfo | null>(null);
  const [dosenVerificationStatus, setDosenVerificationStatus] =
    useState<DosenVerificationStatus | null>(null);
  const [jadwalSidangStatus, setJadwalSidangStatus] =
    useState<JadwalSidangStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          statsData,
          announcementsData,
          systemStatusData,
          periodeData,
          dosenVerificationData,
          jadwalSidangData,
        ] = await Promise.all([
          getAdminDashboardStats(),
          getRecentAnnouncements(2),
          getSystemStatus(),
          getPeriodeInfo(),
          getDosenVerificationStatus(),
          getJadwalSidangStatus(),
        ]);

        setStats(statsData);
        setAnnouncements(
          Array.isArray(announcementsData.data)
            ? announcementsData.data
            : [announcementsData.data]
        );
        setSystemStatus(systemStatusData);
        setPeriodeInfo(periodeData);
        setDosenVerificationStatus(dosenVerificationData);
        setJadwalSidangStatus(jadwalSidangData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Dashboard
              </h2>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image Section */}
      <div className="relative w-full h-[280px] md:h-[320px] lg:h-[360px]">
        <Image
          src="/images/dashboard-mahasiswa.svg"
          alt="Dashboard Admin"
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
            Selamat Datang, Admin GATA
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Kelola sistem tugas akhir, dosen pembimbing, dan pantau semua
            aktivitas akademik dengan efisien
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Ringkasan Sistem GATA
            </h2>
            <p className="text-gray-600">
              Statistik lengkap mahasiswa, dosen, jadwal sidang, dan pengumuman
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mahasiswa Tugas Akhir */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +
                    {stats?.mahasiswa.persentase_pertumbuhan || 0}%
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Mahasiswa Tugas Akhir
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {stats?.mahasiswa.total || 0}
                  </span>
                  <span className="text-xs text-gray-500">mahasiswa</span>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  ✓ {stats?.mahasiswa.terdaftar_semester_ini || 0} Terdaftar
                  semester ini
                </p>
              </CardContent>
            </Card>

            {/* Dosen Pembimbing */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-200 text-green-700 text-xs font-semibold">
                    Aktif
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-1">Dosen Pembimbing</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    {stats?.dosen.aktif || 0}
                  </span>
                  <span className="text-xs text-gray-500">dosen</span>
                </div>
                <p className="text-xs text-green-600 mt-3">
                  ✓ {stats?.dosen.tersedia_bimbingan || 0} Tersedia untuk
                  bimbingan
                </p>
              </CardContent>
            </Card>

            {/* Jadwal Sidang */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg border-orange-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-orange-200 text-orange-700 text-xs font-semibold">
                    Pending
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-1">Jadwal Sidang</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    {stats?.jadwal_sidang.total_minggu_ini || 0}
                  </span>
                  <span className="text-xs text-gray-500">sidang</span>
                </div>
                <p className="text-xs text-orange-600 mt-3">
                  ⏰ {jadwalSidangStatus?.hari_pertama_sidang || "Minggu ini"}
                </p>
              </CardContent>
            </Card>

            {/* Pengumuman */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Pengumuman</p>
                <p className="text-gray-500 text-sm mb-4">
                  Buat pengumuman baru
                </p>
                <a
                  href={`/admin/pengumuman`}
                  className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Buat <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Section - Key Information */}
          <div className="xl:col-span-2 space-y-6">
            {/* System Overview */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">
                    Informasi Sistem
                  </CardTitle>
                  <Badge variant="default" className="bg-blue-500">
                    Live
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Status dan informasi penting sistem GATA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* System Status 1 */}
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          Periode Aktif
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700"
                        >
                          {periodeInfo?.semester || "Semester"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sistem siap menerima pendaftaran mahasiswa baru
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          📅 Mulai:{" "}
                          {periodeInfo?.tanggal_mulai
                            ? new Date(
                                periodeInfo.tanggal_mulai + "T00:00:00Z"
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </span>
                        <span>
                          🏁 Berakhir:{" "}
                          {periodeInfo?.tanggal_berakhir
                            ? new Date(
                                periodeInfo.tanggal_berakhir + "T00:00:00Z"
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Status 2 */}
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          Verifikasi Dosen
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`${
                            dosenVerificationStatus?.persentase_verifikasi ===
                            100
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {dosenVerificationStatus?.persentase_verifikasi || 0}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Semua data dosen pembimbing telah terverifikasi
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          ✓ {dosenVerificationStatus?.total_dosen || 0} total
                          dosen
                        </span>
                        <span>
                          ✓ {dosenVerificationStatus?.terverifikasi || 0}
                          terverifikasi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Status 3 */}
                  <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          Jadwal Sidang
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700"
                        >
                          {jadwalSidangStatus?.total_terjadwal_minggu_ini || 0}{" "}
                          Terjadwal
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Ada{" "}
                        {jadwalSidangStatus?.total_terjadwal_minggu_ini || 0}{" "}
                        sidang yang telah dijadwalkan minggu ini
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          ⏰ {jadwalSidangStatus?.hari_pertama_sidang || "-"}
                        </span>
                        <span>
                          📍{" "}
                          {jadwalSidangStatus?.ruang_tersedia
                            ? "Ruang tersedia"
                            : "Ruang penuh"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">
                    Pengumuman Terbaru
                  </CardTitle>
                  <Badge variant="outline" className="text-gray-600">
                    2 Terbaru
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Pengumuman terkini untuk mahasiswa dan dosen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements && announcements.length > 0 ? (
                    <>
                      {announcements.map((announcement) => {
                        const isHighPriority = announcement.priority === "high";
                        const title =
                          announcement.title || announcement.judul || "-";
                        const description =
                          announcement.content || announcement.deskripsi || "-";
                        const dateCreated =
                          announcement.created_at ||
                          announcement.tanggal_dibuat;
                        const author = announcement.author || "Admin";

                        return (
                          <div
                            key={announcement.id}
                            className={`flex items-start space-x-4 p-4 hover:shadow-md rounded-xl border transition-colors cursor-pointer ${
                              isHighPriority
                                ? "bg-blue-50 hover:bg-blue-100 border-blue-200"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isHighPriority ? "bg-blue-100" : "bg-gray-100"
                              }`}
                            >
                              <Bell
                                className={`w-5 h-5 ${
                                  isHighPriority
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {title}
                                </p>
                                <Badge
                                  className={`text-xs font-medium flex-shrink-0 ml-2 ${
                                    isHighPriority
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {isHighPriority ? "Penting" : "Informasi"}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                                <span>
                                  {dateCreated
                                    ? new Date(
                                        dateCreated.replace(/Z$/, "")
                                      ).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "-"}
                                </span>
                                <span className="truncate">• {author}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Tidak ada pengumuman terbaru</p>
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    <a
                      href={`/admin/pengumuman`}
                      className="flex items-center gap-2 text-center font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Lihat Semua Pengumuman →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Statistik Cepat
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Data ringkas per kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Mahasiswa Baru */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        Mahasiswa Baru
                      </p>
                      <Badge variant="default" className="bg-blue-500 text-xs">
                        {stats?.summary?.mahasiswa_baru || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats?.mahasiswa.total &&
                            stats?.summary?.mahasiswa_baru
                              ? (stats.summary.mahasiswa_baru /
                                  stats.mahasiswa.total) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {stats?.mahasiswa.total && stats?.summary?.mahasiswa_baru
                        ? Math.round(
                            (stats.summary.mahasiswa_baru /
                              stats.mahasiswa.total) *
                              100
                          )
                        : 0}
                      % dari total
                    </p>
                  </div>

                  {/* Dosen Aktif */}
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        Dosen Aktif
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs"
                      >
                        {stats?.dosen.aktif || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats?.dosen.total
                              ? (stats.dosen.aktif / stats.dosen.total) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {stats?.dosen.total
                        ? Math.round(
                            (stats.dosen.aktif / stats.dosen.total) * 100
                          )
                        : 0}
                      % terverifikasi
                    </p>
                  </div>

                  {/* Sidang Selesai */}
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        Sidang Selesai
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 text-xs"
                      >
                        {stats?.jadwal_sidang.status_breakdown.selesai || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats?.summary.tingkat_penyelesaian
                              ? parseInt(stats.summary.tingkat_penyelesaian)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {stats?.summary.tingkat_penyelesaian || "0%"} Tahun ini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management Actions */}
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg border-indigo-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Kelola Sistem
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Akses menu administrasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a
                    href={`/admin/pengumuman`}
                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm font-medium text-gray-900"
                  >
                    <span>Kelola Pengumuman</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href={`/admin/users`}
                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm font-medium text-gray-900"
                  >
                    <span>Kelola Users</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href={`/admin/tugas-akhir`}
                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm font-medium text-gray-900"
                  >
                    <span>Kelola TA</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href={`/admin/sidang`}
                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm font-medium text-gray-900"
                  >
                    <span>Kelola Sidang</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </a>

                  <a
                    href={`/admin/penilaian/rubrik`}
                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm font-medium text-gray-900"
                  >
                    <span>Kelola Rubrik</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Status Sistem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Server</span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          systemStatus?.api_server === "online"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={`text-xs font-medium ${
                          systemStatus?.api_server === "online"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {systemStatus?.api_server === "online"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          systemStatus?.database === "online"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={`text-xs font-medium ${
                          systemStatus?.database === "online"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {systemStatus?.database === "online"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scheduler</span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          systemStatus?.scheduler === "online"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={`text-xs font-medium ${
                          systemStatus?.scheduler === "online"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {systemStatus?.scheduler === "online"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
