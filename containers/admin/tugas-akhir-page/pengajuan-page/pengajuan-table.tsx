"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@/components/popup/approval";
import { MoreHorizontalIcon } from "lucide-react";
import DetailPengajuanModal from "./DetailPengajuanModal";
import { BlueDark, PurpleLight, BlueLight } from "@/components/buttons/status";
import { FPApprovalRequest } from "@/types/admin";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  data: FinalProjectData[];
  onApproval: (data: any) => Promise<any>;
}

export interface FinalProjectData {
  id: number;
  type: "regular" | "capstone";
  status: "baru" | "dispensasi";
  source_topic: "dosen" | "perusahaan" | "mandiri";
  description: string | null;
  max_members: number;
  supervisor_1_status: "pending" | "approved" | "rejected";
  supervisor_2_status: "pending" | "approved" | "rejected";
  admin_status: string | "pending" | "approved" | "rejected" | "all";
  supervisor_1_note: string | null;
  supervisor_2_note: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  members: Members[];
  supervisor_1: Supervisor;
  supervisor_2: Supervisor | null;
}

export interface Members {
  id: number;
  title: string;
  resume: string;
  draft_path: string;
  draft_filename: string;
  draft_size: string;
  dispen_path: string | null;
  dispen_filename: string | null;
  dispen_size: string | null;
  created_at: string;
  updated_at: string;
  student: {
    id: number;
    nim: string;
    semester: number;
    user: {
      id: number;
      googleId: string | null;
      role: string;
      name: string;
      email: string;
      whatsapp_number: string | null;
      is_active: boolean;
    };
  };
}

export interface Supervisor {
  id: number;
  nip: string;
  lecturer_code: string;
  current_supervised_1: number;
  current_supervised_2: number;
  max_supervised_1: number;
  max_supervised_2: number;
  user: {
    id: number;
    googleId: string | null;
    role: string;
    name: string;
    email: string;
    whatsapp_number: string | null;
    is_active: boolean;
  };
}

const PengajuanTable: React.FC<Props> = ({ data, onApproval }) => {
  // Dummy Data
  // const datas: any = [
  //   ...Array.from({ length: 200 }, (_, i) => {
  //     const baseId = i + 1;
  //     return {
  //       id: baseId,
  //       type: "regular",
  //       status: "baru",
  //       source_topic: "perusahaan",
  //       supervisor_1_status: "pending",
  //       supervisor_2_status: "pending",
  //       created_at: "2025-10-20T07:14:27.835Z",
  //       members: [
  //         {
  //           id: baseId + 100, // agar unik
  //           title: "sdasd",
  //           resume: "sads",
  //           draft_path: "final-projects/drafts/1760944467850-surat.pdf",
  //           draft_filename: "surat.pdf",
  //           draft_size: "2.77",
  //           dispen_path: "",
  //           dispen_filename: "",
  //           dispen_size: "",
  //           created_at: "2025-10-20T07:14:27.856Z",
  //           student: {
  //             id: baseId + 200,
  //             nim: `2025000${baseId}`,
  //             user: {
  //               name: `Student ${baseId}`,
  //             },
  //           },
  //         },
  //       ],
  //       supervisor_choices: "1",
  //       supervisor_status: "pending",
  //     };
  //   }),
  // ];

  // Data
  const [pengajuanData, setPengajuanData] = useState<FinalProjectData[] | null>(
    data
  );
  const [selectedStudent, setSelectedStudent] =
    useState<FinalProjectData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<FinalProjectData["admin_status"]>("pending");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAlertApprove, setIsAlertApprove] = useState(false);
  const [isAlertReject, setIsAlertReject] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [currentData, setCurrentData] = useState<FinalProjectData[] | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<FinalProjectData[] | null>(
    null
  );

  const searchParams = useSearchParams();
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    filteringData();
  }, [data, searchTerm, currentPage, statusFilter, itemsPerPage]);

  const filteringData = () => {
    if (data) {
      // filter data ketika ada params pembimbing
      const code = searchParams.get("c");
      const p = searchParams.get("p");

      if (code && p) {
        let paramFilter = pengajuanData?.filter((student) => {
          const matchesParam = student.members.some((anggota) => {
            if (p === "1") {
              return (
                student.supervisor_1.lecturer_code.toLowerCase() ===
                code.toLowerCase()
              );
            } else {
              return (
                student.supervisor_2?.lecturer_code.toLowerCase() ===
                code.toLowerCase()
              );
            }
          });

          return matchesParam;
        });
      }

      // Filter data based on search and status
      let filteredData = pengajuanData?.filter((student) => {
        const matchesSearch = student.members.some(
          (anggota) =>
            anggota.student.user.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            anggota.student.nim
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            anggota.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.supervisor_1.lecturer_code
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            student.supervisor_2?.lecturer_code
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );

        const matchesParam = student.members.some((anggota) => {
          if (code && p) {
            if (p === "1") {
              return (
                student.supervisor_1.lecturer_code.toLowerCase() ===
                code?.toLowerCase()
              );
            } else {
              return (
                student.supervisor_2?.lecturer_code.toLowerCase() ===
                code?.toLowerCase()
              );
            }
          }
        });

        const matchesStatus =
          statusFilter === "all" || student.admin_status === statusFilter;

        if (matchesParam) {
          return matchesSearch && matchesStatus && matchesParam;
        }

        return matchesSearch && matchesStatus;
      });

      if (filteredData) {
        setFilteredData(filteredData);

        // Calculate pagination
        const totalPagesCount = Math.ceil(filteredData.length / itemsPerPage);
        setTotalPages(totalPagesCount);

        const newStartIndex = (currentPage - 1) * itemsPerPage;
        const newEndIndex = newStartIndex + itemsPerPage;

        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
        setCurrentData(filteredData.slice(newStartIndex, newEndIndex));
      }
    }
  };

  const handleDetailOpen = (data: FinalProjectData) => {
    if (isAlertApprove || isAlertReject) return;
    setSelectedStudent(data);
    setIsDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedStudent(null);
  };

  const handleApprove = async () => {
    if (selectedStudent) {
      try {
        const data: FPApprovalRequest = {
          fpId: selectedStudent.id,
          status: "approved",
        };
        const response = await onApproval(data);

        if (response.ok) {
          // Update local state to reflect the change
          window.location.reload();
        }
      } catch (error) {
        console.error("Error approving student:", error);
      }
    }
  };
  const handleReject = async () => {
    if (selectedStudent) {
      try {
        const data: FPApprovalRequest = {
          fpId: selectedStudent.id,
          status: "rejected",
        };
        const response = await onApproval(data);

        if (response.ok) {
          // Update local state to reflect the change
          window.location.reload();
        }
      } catch (error) {
        console.error("Error rejecting student:", error);
      }
    }
  };

  return (
    <div className="w-full p-0">
      {/* Detail Pop up */}
      <DetailPengajuanModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailClose}
        data={selectedStudent}
        setIsAlertApprove={setIsAlertApprove}
        setIsAlertReject={setIsAlertReject}
        setSelectedStudent={setSelectedStudent}
      />

      {/* Alert */}
      <Alert
        isOpen={isAlertApprove}
        onClose={() => setIsAlertApprove(false)}
        onConfirm={handleApprove}
      />

      <Alert
        isOpen={isAlertReject}
        onClose={() => setIsAlertReject(false)}
        onConfirm={handleReject}
      />

      {/* Table Section */}
      <section className="content-section p-2 w-full">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-secondary px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[700px] rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle"
                >
                  Nama
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle"
                >
                  Tipe
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  Pilihan Pembimbing
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  Status Pembimbing
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle"
                >
                  Status
                </th>
                {/* <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle"
                ></th>  */}
              </tr>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  1
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  1
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentData &&
                currentData.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDetailOpen(student)}
                  >
                    {/* Nama */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.members.length === 1 ? (
                            <>
                              {student.members[0].student.user.name}
                              <div className="text-xs text-gray-500">
                                {student.members[0].student.nim}
                              </div>
                            </>
                          ) : (
                            <>
                              {student.members[0].student.user.name} +{" "}
                              {student.members.length - 1} anggota lainnya
                              <div className="text-xs text-gray-500">
                                {student.members
                                  .map((a) => a.student.nim)
                                  .join(", ")}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Tipe */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {student.type === "regular" ? (
                        <BlueDark text="Reguler" />
                      ) : (
                        <PurpleLight text="Capstone" />
                      )}
                    </td>
                    {/* Pilihan Pembimbing 1 */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {student.supervisor_1.lecturer_code}
                    </td>
                    {/* Pilihan Pembimbing 2  */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {student.supervisor_2
                        ? student.supervisor_2.lecturer_code
                        : "-"}
                    </td>
                    {/* Status Pembimbing 1  */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          student.supervisor_1_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.supervisor_1_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                      >
                        {student.supervisor_1_status === "pending"
                          ? "Menunggu"
                          : student.supervisor_1_status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                      </span>
                    </td>
                    {/* Status Pembimbing 2  */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          student.supervisor_2_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.supervisor_2_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                      >
                        {student.supervisor_2_status === "pending"
                          ? "Menunggu"
                          : student.supervisor_2_status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                      </span>
                    </td>
                    {/* Status  */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          student.admin_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.admin_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                      >
                        {student.admin_status === "pending"
                          ? "Menunggu"
                          : student.admin_status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                      </span>
                    </td>
                    {/* action buttons */}
                    {/* <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {student.admin_status === "pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-md bg-secondary border border-black-300 hover:bg-gray-background hover:text-black cursor-pointer">
                              <MoreHorizontalIcon size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                className="text-green-600 cursor-pointer focus:bg-green-100 data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student);
                                  setIsAlertApprove(true);
                                }}
                              >
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer focus:bg-red-100 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student);
                                  setIsAlertReject(true);
                                }}
                              >
                                Tolak
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Section */}
      <section>
        {filteredData && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} sampai{" "}
              {Math.min(endIndex, filteredData.length)} dari{" "}
              {filteredData.length} hasil
            </div>

            {/* jumlah data perPage */}
            <div>
              <label className="mr-2 text-sm text-gray-700">
                Data per halaman:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Tombol pagination */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              {/* Pagination dengan ellipsis */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 5; // Jumlah tombol halaman yang ditampilkan

                if (totalPages <= maxVisiblePages + 2) {
                  // Jika total halaman sedikit, tampilkan semua
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === i
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  // Selalu tampilkan halaman pertama
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      1
                    </button>
                  );

                  // Ellipsis kiri
                  if (currentPage > 3) {
                    pages.push(
                      <span
                        key="ellipsis-left"
                        className="px-3 py-2 text-sm font-medium text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  // Halaman di sekitar halaman aktif
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === i
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Ellipsis kanan
                  if (currentPage < totalPages - 2) {
                    pages.push(
                      <span
                        key="ellipsis-right"
                        className="px-3 py-2 text-sm font-medium text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  // Selalu tampilkan halaman terakhir
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PengajuanTable;
