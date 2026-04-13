"use client";

import React, { useEffect, useState } from "react";
import { Download, FileText, User, AlertCircle, Loader, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { getHasilSidang, downloadBAPPdf } from "@/utils/hasil-sidang-api";
import type {
  HasilSidang,
  DosenPenguji,
  KomentarDosen,
} from "@/types/hasil-sidang";

const HasilSidangPage: React.FC = () => {
  const { user } = useAuth();
  const [hasilSidang, setHasilSidang] = useState<HasilSidang | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedKomentar, setSelectedKomentar] =
    useState<KomentarDosen | null>(null);

  // Fetch hasil sidang data on component mount
  useEffect(() => {
    const fetchHasilSidang = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getHasilSidang(user.id);

        if (response.success && response.data) {
          setHasilSidang(response.data);
        } else {
          setError(response.message || "Gagal memuat data hasil sidang");
        }
      } catch (err) {
        console.error("Error fetching hasil sidang:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHasilSidang();
  }, [user?.id]);

  const getNilaiBadgeVariant = (nilai: number) => {
    if (nilai >= 80) {
      return "bg-green-100 text-green-700 border-green-300";
    } else if (nilai >= 65) {
      return "bg-blue-100 text-blue-700 border-blue-300";
    } else if (nilai >= 50) {
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    } else {
      return "bg-red-100 text-red-700 border-red-300";
    }
  };

  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const handleDownloadBAP = async () => {
    // Construct full URL if needed
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";
    const fullUrl = baseUrl + hasilSidang?.bapUrl;

    // Open PDF in new tab
    window.open(fullUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Loading State */}
        {isLoading && (
          <Card className="bg-white border-none shadow-md">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-gray-600">
                  Memuat data hasil sidang...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="bg-red-50 border-red-200 shadow-md">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informasi Mahasiswa */}
        {hasilSidang && !isLoading && (
          <>
            <Card className="bg-[#F5F7FA] border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 text-xl">
                  <User className="w-5 h-5" />
                  Informasi Mahasiswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama</p>
                    <p className="text-base font-semibold text-gray-900">
                      {hasilSidang.studentInfo.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">NIM</p>
                    <p className="text-base font-semibold text-gray-900">
                      {hasilSidang.studentInfo.nim}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Tanggal Sidang</p>
                    <p className="text-base font-semibold text-gray-900">
                      {hasilSidang.studentInfo.tanggalSidang}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hasil Sidang */}
            <Card
              className={`shadow-md ${
                hasilSidang.hasilAkhir === "LULUS"
                  ? "bg-green-50 border-green-200"
                  : hasilSidang.hasilAkhir === "TIDAK LULUS"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                  <FileText className="w-5 h-5" />
                  Hasil Sidang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div
                    className={`text-white px-8 py-4 rounded-lg ${
                      hasilSidang.hasilAkhir === "LULUS"
                        ? "bg-[#22c55e]"
                        : hasilSidang.hasilAkhir === "TIDAK LULUS"
                        ? "bg-[#ef4444]"
                        : "bg-[#f59e0b]"
                    }`}
                  >
                    <p className="text-3xl font-bold text-center">
                      {hasilSidang.hasilAkhir}
                      {hasilSidang.hasilAkhir === "LULUS" ? "" : ""}
                    </p>
                    {hasilSidang.nilaiAkhir && (
                      <p className="text-sm text-center mt-2 opacity-90">
                        Nilai Akhir: {hasilSidang.nilaiAkhir.toFixed(2)}
                        {hasilSidang.nilaiHuruf &&
                          ` (${hasilSidang.nilaiHuruf})`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabel Dosen */}
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-16 text-center font-semibold">
                          No
                        </TableHead>
                        <TableHead className="font-semibold">Dosen</TableHead>
                        <TableHead className="font-semibold">Peran</TableHead>
                        <TableHead className="text-center font-semibold">
                          Nilai
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hasilSidang.dosenList.map((dosen: DosenPenguji) => (
                        <TableRow key={dosen.id} className="hover:bg-gray-50">
                          <TableCell className="text-center font-medium">
                            {dosen.no}
                          </TableCell>
                          <TableCell className="font-medium">
                            {dosen.nama}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {dosen.peran}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`${getNilaiBadgeVariant(
                                dosen.nilai
                              )} font-semibold`}
                            >
                              {dosen.nilai.toFixed(2)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Komentar Dosen */}
            {hasilSidang.komentar && hasilSidang.komentar.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800 text-lg">
                    Komentar Dosen
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Lihat komentar dan umpan balik dari dosen pembimbing dan
                    penguji
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Komentar Buttons */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hasilSidang.komentar.map((k: KomentarDosen) => (
                      <button
                        key={k.kode}
                        onClick={() => setSelectedKomentar(k)}
                        className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                          selectedKomentar?.kode === k.kode
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {k.kode}
                      </button>
                    ))}
                  </div>

                  {/* Komentar Display */}
                  {selectedKomentar && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        {/* Header dengan nama dan tanggal */}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedKomentar.nama}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTanggal(selectedKomentar.tanggal)}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-300"></div>

                        {/* Komentar Text */}
                        <div>
                          <p className="text-sm text-gray-700 font-medium mb-1">
                            KOMENTAR {selectedKomentar.kode}
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedKomentar.komentar}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!selectedKomentar && (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-gray-500">
                        Pilih kode dosen untuk melihat komentar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Unduh BAP */}
            <Card className="shadow-md border-2 border-gray-200">
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-700 text-base">
                    Unduh BAP kamu yang sudah tertanda tangan disini
                  </p>
                  {hasilSidang.bapUrl && (
                    <Button
                      onClick={handleDownloadBAP}
                      disabled={isDownloading}
                      className="bg-[#305CF4] hover:bg-[#2347c5] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  )}
                  {!hasilSidang.bapUrl && (
                    <p className="text-sm text-gray-500 italic">
                      BAP belum tersedia untuk diunduh
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default HasilSidangPage;
