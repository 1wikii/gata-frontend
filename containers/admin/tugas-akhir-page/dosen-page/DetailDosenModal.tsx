"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";

export interface StudentData {
  id?: number;
  supervisor_status?: string;
  type?: string;
  status?: string;
  supervisor_choices?: string;
  members?: Array<{
    student?: { user?: { name: string }; nim: string };
    name?: string;
    title?: string;
    [key: string]: any;
  }>;
  nip?: string;
  user?: { name: string };
  [key: string]: any;
}
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: StudentData | null;
}

const DetailPengajuanModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            Menunggu
          </span>
        );
      case "approved":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  const handleDownload = (fileUrl: string) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/${fileUrl}`;
    window.open(url, "_blank");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 lg:max-w-4xl">
        {/* Modal Content */}
        {/* Header */}
        <AlertDialogHeader className="w-full flex flex-row items-center justify-between p-6 border-b border-gray-200">
          <AlertDialogTitle>Detail Bimbingan Mahasiswa</AlertDialogTitle>
          <AlertDialogDescription />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </AlertDialogHeader>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Status Persetujuan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Persetujuan
            </label>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                data.supervisor_status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : data.supervisor_status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {data.supervisor_status === "pending"
                ? "Menunggu"
                : data.supervisor_status === "approved"
                ? "Disetujui"
                : "Ditolak"}
            </span>
          </div>
          {/* Overall Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Tipe Tugas Akhir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Tugas Akhir
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  data.type === "regular"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {data.type === "regular" ? "Reguler" : "Capstone"}
              </span>
            </div>
            {/* Status Mahasiswa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Mahasiswa
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  data.status === "baru"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {data.status === "baru" ? "Baru" : "Dispensasi"}
              </span>
            </div>

            {/* Pilihan Dosen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilihan Dosen Pembimbing
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  data.supervisor_choices === "1"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {data.supervisor_choices === "1"
                  ? "Pembimbing 1"
                  : "Pembimbing 2"}
              </span>
            </div>
          </div>

          {/* Anggota Mahasiswa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Anggota Mahasiswa ({data.members?.length || 0} orang)
            </label>

            {/* Anggota Mahasiswa */}
            <div className="space-y-4">
              {data.members?.map((anggota, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    {/* Anggota Mahasiswa */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                          {index + 1}
                        </div>
                        {/* Name */}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {anggota.student?.user?.name ||
                              anggota.name ||
                              "Nama Tidak Tersedia"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {anggota.student?.nim || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Judul */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Judul Tugas Akhir
                        </label>
                        {anggota.title ? (
                          <p className="text-base text-gray-900 font-medium">
                            {anggota.title}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Tidak tersedia
                          </p>
                        )}
                      </div>

                      {/* Resume */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resume
                        </label>
                        {anggota.resume ? (
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {anggota.resume}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Tidak tersedia
                          </p>
                        )}
                      </div>
                    </div>

                    {/* File actions */}
                    <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="flex gap-2">
                        {anggota.draft_path && (
                          <button
                            onClick={() => handleDownload(anggota.draft_path)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <FaFilePdf className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-900 font-medium">
                              {anggota.draft_filename}
                            </span>
                          </button>
                        )}

                        {anggota.dispen_path && (
                          <button
                            onClick={() => handleDownload(anggota.dispen_path)}
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
                          >
                            <FaFilePdf className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-900 font-medium">
                              {anggota.dispen_filename}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DetailPengajuanModal;
