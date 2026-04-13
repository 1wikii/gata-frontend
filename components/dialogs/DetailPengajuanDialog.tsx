"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { PengajuanSidang } from "@/types/pengajuan-sidang";
import StatusPengajuanBadge from "@/components/badges/StatusPengajuanBadge";
import JenisSidangBadge from "@/components/badges/JenisSidangBadge";
import RegCapBadge from "@/components/badges/RegCapBadge";
import {
  User,
  Mail,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle,
  MessageSquare,
  Award,
  Users,
  X,
  Check,
  FileDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DetailPengajuanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pengajuan: PengajuanSidang | null;
  onApprove?: (id: number) => void;
  onReject?: (id: number, alasan: string) => void;
}

const DetailPengajuanDialog: React.FC<DetailPengajuanDialogProps> = ({
  open,
  onOpenChange,
  pengajuan,
  onApprove,
  onReject,
}) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [alasanPenolakan, setAlasanPenolakan] = useState("");

  if (!pengajuan) return null;

  // Helper to get mahasiswa array
  const mahasiswaList = Array.isArray(pengajuan.mahasiswa)
    ? pengajuan.mahasiswa
    : [pengajuan.mahasiswa];

  const handleApprove = () => {
    if (onApprove) {
      onApprove(pengajuan.id);
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    if (onReject && alasanPenolakan.trim()) {
      onReject(pengajuan.id, alasanPenolakan);
      setAlasanPenolakan("");
      setShowRejectInput(false);
      onOpenChange(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMenunggu = pengajuan.status === "menunggu";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="!max-w-4xl max-h-[70vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <AlertDialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Detail Pengajuan Sidang
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Informasi lengkap pengajuan sidang mahasiswa
              </AlertDialogDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <StatusPengajuanBadge status={pengajuan.status} />
              <JenisSidangBadge jenis={pengajuan.jenisSidang} />
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Informasi Mahasiswa */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Informasi Mahasiswa{" "}
                {mahasiswaList.length > 1 && `(${mahasiswaList.length} orang)`}
              </h3>
            </div>
            <div className="space-y-3">
              {mahasiswaList.map((mhs, index) => (
                <div
                  key={mhs.id}
                  className="bg-white p-4 rounded-lg border border-blue-100"
                >
                  {mahasiswaList.length > 1 && (
                    <div className="mb-3 pb-2 border-b border-blue-100">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        Anggota {index + 1}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Nama
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {mhs.nama}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">NIM</p>
                        <p className="text-sm font-semibold text-gray-900 font-mono">
                          {mhs.nim}
                        </p>
                      </div>
                    </div>
                    {mhs.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Email
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {mhs.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informasi Tugas Akhir */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Informasi Tugas Akhir
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Judul Tugas Akhir
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {pengajuan.judulTA}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Tipe TA
                  </p>
                  <RegCapBadge tipe={pengajuan.tipeTA} />
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Jenis Sidang
                  </p>
                  <JenisSidangBadge jenis={pengajuan.jenisSidang} />
                </div>
              </div>
              {pengajuan.kelompokKeahlian && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    Kelompok Keahlian
                  </p>
                  <div className="flex flex-col items-start gap-y-2">
                    <div className="text-sm font-medium text-indigo-700 px-3 py-1 rounded-full bg-indigo-100">
                      {pengajuan.kelompokKeahlian?.kk1 || "-"}
                    </div>
                    <div className="text-sm font-medium text-indigo-700 px-3 py-1 rounded-full bg-indigo-100">
                      {pengajuan.kelompokKeahlian?.kk2 || "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dosen Pembimbing */}
          {pengajuan.dosenPembimbing &&
            pengajuan.dosenPembimbing.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-5 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Dosen Pembimbing
                  </h3>
                </div>
                <div className="space-y-2">
                  {pengajuan.dosenPembimbing.map((dosen, index) => (
                    <div
                      key={dosen.id}
                      className="bg-white p-3 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-700">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {dosen.nama}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Progress Bimbingan */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-5 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Progress Bimbingan
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Jumlah Bimbingan
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {pengajuan.jumlahBimbingan} / {pengajuan.minimalBimbingan}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    pengajuan.jumlahBimbingan >= pengajuan.minimalBimbingan
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (pengajuan.jumlahBimbingan / pengajuan.minimalBimbingan) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {pengajuan.jumlahBimbingan >= pengajuan.minimalBimbingan
                  ? "✓ Memenuhi syarat minimal bimbingan"
                  : `Kurang ${
                      pengajuan.minimalBimbingan - pengajuan.jumlahBimbingan
                    } sesi lagi`}
              </p>
            </div>
          </div>

          {/* Dokumen Pendukung */}
          {pengajuan.dokumenPendukung.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-xl p-5 border border-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Dokumen Pendukung ({pengajuan.dokumenPendukung.length})
                </h3>
              </div>
              <div className="space-y-2">
                {pengajuan.dokumenPendukung.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white p-3 rounded-lg hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileDown className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700">
                        {doc.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
          )}

          {/* Informasi Pengajuan */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">
                Informasi Pengajuan
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Tanggal Pengajuan
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(pengajuan.tanggalPengajuan)}
                </p>
              </div>
              {pengajuan.tanggalDiproses && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Tanggal Diproses
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(pengajuan.tanggalDiproses)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Catatan/Alasan Penolakan */}
          {pengajuan.catatan && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Catatan Mahasiswa
                </h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {pengajuan.catatan}
              </p>
            </div>
          )}

          {pengajuan.catatanPenolakan && (
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <X className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Alasan Penolakan
                </h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {pengajuan.catatanPenolakan}
              </p>
            </div>
          )}

          {/* Input Alasan Penolakan */}
          {showRejectInput && isMenunggu && (
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <Label htmlFor="alasan" className="text-sm font-semibold mb-2">
                Alasan Penolakan *
              </Label>
              <textarea
                id="alasan"
                value={alasanPenolakan}
                onChange={(e) => setAlasanPenolakan(e.target.value)}
                placeholder="Masukkan alasan penolakan pengajuan sidang..."
                className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
              />
            </div>
          )}
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={() => {
              setShowRejectInput(false);
              setAlasanPenolakan("");
            }}
          >
            Tutup
          </AlertDialogCancel>

          {isMenunggu && (
            <>
              {!showRejectInput ? (
                <>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Tolak
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Setujui
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowRejectInput(false);
                      setAlasanPenolakan("");
                    }}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!alasanPenolakan.trim()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Konfirmasi Tolak
                  </button>
                </>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DetailPengajuanDialog;
