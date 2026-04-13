"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  Clock,
} from "lucide-react";

const TugasAkhirPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Data dummy untuk statistik
  const stats = {
    totalMahasiswa: 156,
    mahasiswaDiterima: 89,
    mahasiswaDitolak: 23,
    pengajuanValidasi: 12,
    tanpaDosenPembimbing: 44,
  };

  const percentages = {
    persentaseDiterima: 57,
    persentaseDitolak: 15,
    persentaseTanpaDosen: 28,
    validasiPending: 12,
  };

  return (
    <div className="main-container p-6 space-y-6">
      {/* Grid untuk 3 card utama di baris pertama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Mahasiswa */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Total Mahasiswa
                  </h3>
                  <p className="text-sm text-gray-500">
                    Keseluruhan mahasiswa terdaftar
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">
                  {stats.totalMahasiswa}
                </div>
                <div className="text-sm text-gray-500">Mahasiswa</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mahasiswa Diterima */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Mahasiswa Diterima
                  </h3>
                  <p className="text-sm text-gray-500">
                    Diterima oleh dosen pembimbing
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600">
                {stats.mahasiswaDiterima}
              </div>
              <div className="text-sm text-gray-500">Mahasiswa</div>
            </div>
          </CardContent>
        </Card>

        {/* Mahasiswa Ditolak */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Mahasiswa Ditolak
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ditolak oleh dosen pembimbing
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-red-600">
                {stats.mahasiswaDitolak}
              </div>
              <div className="text-sm text-gray-500">Mahasiswa</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid untuk 2 card di baris kedua */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pengajuan Validasi Dosen */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Pengajuan Validasi Dosen
                  </h3>
                  <p className="text-sm text-gray-500">
                    Menunggu validasi admin
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                Validasi
              </button>
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-600">
                  {stats.pengajuanValidasi}
                </div>
                <div className="text-sm text-gray-500">Pengajuan</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tanpa Dosen Pembimbing */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Tanpa Dosen Pembimbing
                  </h3>
                  <p className="text-sm text-gray-500">
                    Belum mendapat dosen pembimbing
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-yellow-600">
                {stats.tanpaDosenPembimbing}
              </div>
              <div className="text-sm text-gray-500">Mahasiswa</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Pengaturan Waktu - Full Width */}
      <div>
        {/* Pengaturan Waktu */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Pengaturan Waktu
                  </h3>
                  <p className="text-sm text-gray-500">
                    Periode pendaftaran tugas akhir
                  </p>
                </div>
              </div>
            </div>

            {/* Periode Aktif */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                  Periode Aktif
                </span>
              </div>

              <h4 className="text-sm font-bold text-gray-800 mb-3">
                Pendaftaran Tugas Akhir
              </h4>

              <div className="space-y-2">
                {/* Waktu Mulai */}
                <div className="flex items-center gap-2">
                  <div className="w-20 text-xs font-medium text-gray-600">
                    Mulai:
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    15 Januari 2025, 08:00 WIB
                  </div>
                </div>

                {/* Waktu Selesai */}
                <div className="flex items-center gap-2">
                  <div className="w-20 text-xs font-medium text-gray-600">
                    Selesai:
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    15 Februari 2025, 23:59 WIB
                  </div>
                </div>
              </div>

              {/* Sisa Waktu */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-xs text-gray-600">Sisa waktu:</span>
                  <span className="text-sm font-bold text-blue-600">
                    14 hari 5 jam
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <a
                href={`${baseUrl}/admin/tugas-akhir/periode`}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Kelola Periode
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan Status */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Ringkasan Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Persentase Diterima */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Persentase Diterima
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {percentages.persentaseDiterima}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Persentase Ditolak */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Persentase Ditolak
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {percentages.persentaseDitolak}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Persentase Tanpa Dosen */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Persentase Tanpa Dosen
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {percentages.persentaseTanpaDosen}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validasi Pending */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Validasi Pending</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {percentages.validasiPending}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TugasAkhirPage;
