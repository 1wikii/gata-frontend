"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import {
  PengajuanSidang,
  StatusPengajuan,
  PengajuanSidangApproval,
} from "@/types/pengajuan-sidang";
import StatusPengajuanBadge from "@/components/badges/StatusPengajuanBadge";
import JenisSidangBadge from "@/components/badges/JenisSidangBadge";
import RegCapBadge from "@/components/badges/RegCapBadge";
import DetailPengajuanDialog from "@/components/dialogs/DetailPengajuanDialog";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  getData: () => Promise<any>;
  onApproval: (data: PengajuanSidangApproval) => Promise<any>;
}

const PengajuanSidangPage: React.FC<Props> = ({ getData, onApproval }) => {
  const [pengajuanList, setPengajuanList] = useState<PengajuanSidang[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanSidang | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject" | null;
    id: number | null;
    alasan?: string;
  }>({ type: null, id: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getData();
      const data = await response.json();

      if (response.ok) {
        setPengajuanList(data.data);
      }

      if (!response.ok) {
        console.error("Failed to fetch data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching pengajuan sidang data:", error);
    }
  };

  // Helper function to get mahasiswa array
  const getMahasiswaArray = (mahasiswa: any) => {
    return Array.isArray(mahasiswa) ? mahasiswa : [mahasiswa];
  };

  // Helper function to get display name for mahasiswa
  const getMahasiswaDisplayName = (mahasiswa: any) => {
    const mahasiswaList = getMahasiswaArray(mahasiswa);
    if (mahasiswaList.length === 1) {
      return mahasiswaList[0].nama;
    }
    return `${mahasiswaList[0].nama} +${mahasiswaList.length - 1}`;
  };

  // Helper function to get mahasiswa initials
  const getMahasiswaInitials = (mahasiswa: any) => {
    const mahasiswaList = getMahasiswaArray(mahasiswa);
    return mahasiswaList[0].nama
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2);
  };

  // Helper function to get first NIM
  const getFirstNim = (mahasiswa: any) => {
    const mahasiswaList = getMahasiswaArray(mahasiswa);
    return mahasiswaList[0].nim;
  };

  // Filter and search
  const filteredPengajuan = useMemo(() => {
    return pengajuanList.filter((item) => {
      const mahasiswaList = getMahasiswaArray(item.mahasiswa);
      const matchSearch =
        mahasiswaList.some((mhs) =>
          mhs.nama.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        mahasiswaList.some((mhs) =>
          mhs.nim.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        item.judulTA.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        filterStatus === "all" || item.status === filterStatus;
      const matchJenis =
        filterJenis === "all" || item.jenisSidang === filterJenis;

      return matchSearch && matchStatus && matchJenis;
    });
  }, [pengajuanList, searchQuery, filterStatus, filterJenis]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPengajuan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredPengajuan.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterJenis, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: pengajuanList.length,
      menunggu: pengajuanList.filter((p) => p.status === "menunggu").length,
      disetujui: pengajuanList.filter((p) => p.status === "disetujui").length,
      ditolak: pengajuanList.filter((p) => p.status === "ditolak").length,
    };
  }, [pengajuanList]);

  const handleRowClick = async (pengajuan: PengajuanSidang) => {
    setSelectedPengajuan(pengajuan);
    setDialogOpen(true);
  };

  const handleApprove = async (id: number) => {
    const approvalData: PengajuanSidangApproval = {
      id,
      status: "approved",
    };
    try {
      const response = await onApproval(approvalData);

      if (response.ok) {
        fetchData();
        setConfirmDialogOpen(false);
        setConfirmAction({ type: null, id: null });
      }
    } catch (error) {
      console.error("Error approving pengajuan:", error);
    }
  };

  const handleReject = async (id: number, alasan: string) => {
    const rejectionData: PengajuanSidangApproval = {
      id,
      status: "rejected",
      rejection_notes: alasan,
    };
    try {
      const response = await onApproval(rejectionData);

      if (response.ok) {
        fetchData();
        setConfirmDialogOpen(false);
        setConfirmAction({ type: null, id: null });
      }
    } catch (error) {
      console.error("Error approving pengajuan:", error);
    }
  };

  const handleShowApproveConfirm = (id: number) => {
    setConfirmAction({ type: "approve", id });
    setConfirmDialogOpen(true);
  };

  const handleShowRejectConfirm = (id: number, alasan: string) => {
    setConfirmAction({ type: "reject", id, alasan });
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction.type === "approve" && confirmAction.id) {
      handleApprove(confirmAction.id);
    } else if (
      confirmAction.type === "reject" &&
      confirmAction.id &&
      confirmAction.alasan
    ) {
      handleReject(confirmAction.id, confirmAction.alasan);
    }
  };

  const handleQuickAction = (
    e: React.MouseEvent,
    pengajuan: PengajuanSidang,
    action: "approve" | "reject"
  ) => {
    e.stopPropagation();
    if (action === "approve") {
      handleShowApproveConfirm(pengajuan.id);
    } else {
      // For quick reject, open dialog to input reason
      setSelectedPengajuan(pengajuan);
      setDialogOpen(true);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pengajuan Sidang Tugas Akhir
            </h1>
            <p className="text-gray-600">
              Kelola dan proses pengajuan sidang mahasiswa
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Pengajuan
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Menunggu
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.menunggu}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Disetujui
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.disetujui}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Ditolak</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.ditolak}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama, NIM, atau judul TA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Filter Status */}
              <div className="w-full lg:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="menunggu">Menunggu</SelectItem>
                    <SelectItem value="disetujui">Disetujui</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Jenis Sidang */}
              <div className="w-full lg:w-48">
                <Select value={filterJenis} onValueChange={setFilterJenis}>
                  <SelectTrigger className="h-11">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Jenis Sidang" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="hasil">Hasil</SelectItem>
                    <SelectItem value="tutup">Tutup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(endIndex, filteredPengajuan.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-900">
                  {filteredPengajuan.length}
                </span>{" "}
                pengajuan
              </p>

              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tampilkan:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="h-9 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per halaman</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Judul TA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Kelompok Keahlian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Bimbingan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.length > 0 ? (
                  paginatedData.map((pengajuan) => (
                    <tr
                      key={pengajuan.id}
                      onClick={() => handleRowClick(pengajuan)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {getMahasiswaInitials(pengajuan.mahasiswa)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {getMahasiswaDisplayName(pengajuan.mahasiswa)}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {getFirstNim(pengajuan.mahasiswa)}
                              {Array.isArray(pengajuan.mahasiswa) &&
                                pengajuan.mahasiswa.length > 1 && (
                                  <span className="ml-1 text-blue-600">
                                    +{pengajuan.mahasiswa.length - 1} lainnya
                                  </span>
                                )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                            {pengajuan.judulTA}
                          </p>
                          <div className="mt-1">
                            <RegCapBadge tipe={pengajuan.tipeTA} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-y-2">
                          <div className="text-sm font-medium text-indigo-700 px-3 py-1 rounded-full bg-indigo-100">
                            {pengajuan.kelompokKeahlian?.kk1 || "-"}
                          </div>
                          <div className="text-sm font-medium text-indigo-700 px-3 py-1 rounded-full bg-indigo-100">
                            {pengajuan.kelompokKeahlian?.kk2 || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <JenisSidangBadge jenis={pengajuan.jenisSidang} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              pengajuan.jumlahBimbingan >=
                              pengajuan.minimalBimbingan
                                ? "bg-green-100"
                                : "bg-orange-100"
                            }`}
                          >
                            <div className="text-center">
                              <p
                                className={`text-xs font-bold ${
                                  pengajuan.jumlahBimbingan >=
                                  pengajuan.minimalBimbingan
                                    ? "text-green-700"
                                    : "text-orange-700"
                                }`}
                              >
                                {pengajuan.jumlahBimbingan}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                /{pengajuan.minimalBimbingan}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {pengajuan.jumlahBimbingan >=
                            pengajuan.minimalBimbingan ? (
                              <span className="text-green-600 font-medium">
                                ✓ Memenuhi
                              </span>
                            ) : (
                              <span className="text-orange-600 font-medium">
                                Kurang{" "}
                                {pengajuan.minimalBimbingan -
                                  pengajuan.jumlahBimbingan}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusPengajuanBadge status={pengajuan.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(pengajuan.tanggalPengajuan)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => handleRowClick(pengajuan)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          </button>
                          {pengajuan.status === "menunggu" && (
                            <>
                              <button
                                onClick={(e) =>
                                  handleQuickAction(e, pengajuan, "approve")
                                }
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                                title="Setujui"
                              >
                                <CheckCircle className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                              </button>
                              <button
                                onClick={(e) =>
                                  handleQuickAction(e, pengajuan, "reject")
                                }
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                title="Tolak"
                              >
                                <XCircle className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold">
                            Tidak ada data
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Tidak ada pengajuan yang sesuai dengan filter
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPengajuan.length > 0 && (
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page info */}
                <div className="text-sm text-gray-600">
                  Halaman{" "}
                  <span className="font-semibold text-gray-900">
                    {currentPage}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (page === 1 || page === totalPages) return true;
                        if (page >= currentPage - 1 && page <= currentPage + 1)
                          return true;
                        return false;
                      })
                      .map((page, index, array) => {
                        // Add ellipsis
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-primary text-white"
                                  : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Detail Dialog */}
      <DetailPengajuanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pengajuan={selectedPengajuan}
        onApprove={handleShowApproveConfirm}
        onReject={handleShowRejectConfirm}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  confirmAction.type === "approve"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {confirmAction.type === "approve" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <AlertDialogTitle className="text-lg">
                  {confirmAction.type === "approve"
                    ? "Setujui Pengajuan?"
                    : "Tolak Pengajuan?"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm mt-1">
                  {confirmAction.type === "approve"
                    ? "Anda akan menyetujui pengajuan sidang ini. Tindakan ini tidak dapat dibatalkan."
                    : "Anda akan menolak pengajuan sidang ini dengan alasan yang telah diberikan. Tindakan ini tidak dapat dibatalkan."}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {/* Show details */}
          {selectedPengajuan && (
            <div className="bg-gray-50 rounded-lg p-3 my-2 space-y-2">
              <div>
                <p className="text-xs text-gray-600 font-medium">Mahasiswa</p>
                <p className="text-sm font-semibold text-gray-900">
                  {getMahasiswaDisplayName(selectedPengajuan.mahasiswa)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Judul TA</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {selectedPengajuan.judulTA}
                </p>
              </div>
              {confirmAction.type === "reject" && confirmAction.alasan && (
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Alasan Penolakan
                  </p>
                  <p className="text-sm text-gray-700">
                    {confirmAction.alasan}
                  </p>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => {
                setConfirmDialogOpen(false);
                setConfirmAction({ type: null, id: null });
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmAction.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmAction.type === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PengajuanSidangPage;
