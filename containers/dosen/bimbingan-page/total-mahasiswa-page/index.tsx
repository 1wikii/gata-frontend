"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RegCapBadge from "@/components/badges/RegCapBadge";
import {
  ChevronLeft,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Search,
} from "lucide-react";
import { JadwalBimbingan } from "@/types/bimbingan";

interface Props {
  getData: () => Promise<any>;
}

interface MahasiswaStats {
  id: number;
  name: string;
  nim: string;
  sessionCount: number;
  proposalSessions: number;
  hasilSessions: number;
  lastSessionDate: string | null;
  tipeTA: string[];
  totalDrafts: number;
}

const TotalMahasiswaPage: React.FC<Props> = ({ getData }) => {
  const [schedules, setSchedules] = useState<JadwalBimbingan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getData();
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Process data to get mahasiswa statistics
  const mahasiswaStats = useMemo(() => {
    const statsMap = new Map<number, MahasiswaStats>();

    schedules.forEach((schedule) => {
      schedule.mahasiswa.forEach((mhs) => {
        if (!statsMap.has(mhs.id)) {
          statsMap.set(mhs.id, {
            id: mhs.id,
            name: mhs.name,
            nim: mhs.nim,
            sessionCount: 0,
            proposalSessions: 0,
            hasilSessions: 0,
            lastSessionDate: null,
            tipeTA: [],
            totalDrafts: 0,
          });
        }

        const stats = statsMap.get(mhs.id)!;
        stats.sessionCount += 1;

        // Count proposal vs hasil sessions
        const isProposal = schedule.defense_type
          .toLowerCase()
          .includes("proposal");
        if (isProposal) {
          stats.proposalSessions += 1;
        } else {
          stats.hasilSessions += 1;
        }

        // Track jenis TA
        if (!stats.tipeTA.includes(schedule.tipeTA)) {
          stats.tipeTA.push(schedule.tipeTA);
        }

        // Update last session date
        if (
          !stats.lastSessionDate ||
          new Date(schedule.session_date) > new Date(stats.lastSessionDate)
        ) {
          stats.lastSessionDate = schedule.session_date;
        }

        // Count drafts
        if (schedule.draftLinks) {
          stats.totalDrafts += schedule.draftLinks.length;
        }
      });
    });

    return Array.from(statsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [schedules]);

  // Filter berdasarkan search term
  const filteredMahasiswa = useMemo(() => {
    return mahasiswaStats.filter(
      (mhs) =>
        mhs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mhs.nim.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mahasiswaStats, searchTerm]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    return {
      totalMahasiswa: mahasiswaStats.length,
      totalSessions: schedules.length,
      avgSessionPerStudent:
        mahasiswaStats.length > 0
          ? (schedules.length / mahasiswaStats.length).toFixed(1)
          : 0,
      regulerCount: mahasiswaStats.filter((m) => m.tipeTA.includes("regular"))
        .length,
      capstoneCount: mahasiswaStats.filter((m) => m.tipeTA.includes("capstone"))
        .length,
    };
  }, [mahasiswaStats, schedules]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="mx-auto space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-start gap-4">
          <Link
            href="/dosen/bimbingan"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Data Mahasiswa Bimbingan
            </h1>
            <p className="text-gray-600">
              Informasi lengkap mahasiswa yang Anda bimbing dan progres
              bimbingan mereka
            </p>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Mahasiswa
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {overallStats.totalMahasiswa}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Sesi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {overallStats.totalSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Rata-rata Sesi
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {overallStats.avgSessionPerStudent}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    TA Reguler
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {overallStats.regulerCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">REG</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    TA Capstone
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {overallStats.capstoneCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-700">CAP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama mahasiswa atau NIM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Daftar Mahasiswa Bimbingan ({filteredMahasiswa.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredMahasiswa.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  {searchTerm
                    ? "Tidak ada mahasiswa yang sesuai dengan pencarian"
                    : "Tidak ada data mahasiswa"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-700 font-semibold">
                        Nama Mahasiswa
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        NIM
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Jenis TA
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Total Sesi
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Proposal
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Hasil
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Draft
                      </TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">
                        Sesi Terakhir
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMahasiswa.map((mhs, index) => (
                      <TableRow
                        key={mhs.id}
                        className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {mhs.name.charAt(0)}
                            </div>
                            {mhs.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          {mhs.nim}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {mhs.tipeTA.map((tipe) => (
                              <RegCapBadge key={tipe} tipe={tipe as any} />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {mhs.sessionCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                            {mhs.proposalSessions}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                            {mhs.hasilSessions}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                            {mhs.totalDrafts}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-gray-600 text-sm">
                          {formatDate(mhs.lastSessionDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 mt-0.5">
                <span className="text-blue-700 font-bold">i</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Informasi Data Bimbingan
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Data menampilkan statistik bimbingan dari jadwal yang telah
                  dibuat. Proposal dan Hasil dihitung berdasarkan topik sesi
                  bimbingan. Jumlah draft adalah total file yang diunggah oleh
                  mahasiswa di setiap sesi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TotalMahasiswaPage;
