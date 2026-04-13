"use client";

import { useEffect, useState } from "react";

import Alert from "@/components/popup/approval";
import { MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DetailPengajuanModal from "./DetailDosenModal";
import { BlueDark, BlueLight } from "@/components/buttons/status";
import { FPApprovalRequest } from "@/types/dosen";

import ButtonActions from "@/components/buttons/table-actions/index";

interface Props {
  data: LecturerData[];
  onApproval: (lcId: number) => Promise<any>;
}

export interface LecturerData {
  id: number;
  nip: string;
  lecturer_code: string;
  current_supervised_1: number;
  current_supervised_2: number;
  max_supervised_1: number;
  max_supervised_2: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  supervisor_1: FinalProjects[];
  supervisor_2: FinalProjects[];
}

export interface FinalProjects {
  id: number;
  type: "regular" | "capstone";
  status: "baru" | "dispensasi";
  source_topic: "dosen" | "perusahaan" | "mandiri";
  description: string | null;
  max_members: number;
  supervisor_1_status: "pending" | "approved" | "rejected";
  supervisor_2_status: "pending" | "approved" | "rejected";
  admin_status: "pending" | "approved" | "rejected";
  supervisor_1_note: string | null;
  supervisor_2_note: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  members: Members[];
}

export interface Members {
  id: number;
  title: string;
  resume: string;
  draft_path: string;
  draft_filename: string;
  draft_size: string;
  dispen_path: string;
  dispen_filename: string;
  dispen_size: string;
  created_at: string;
  student: {
    id: number;
    nim: string;
    user: {
      name: string;
    };
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
  const [pengajuanData, setPengajuanData] = useState<LecturerData[] | null>(
    data
  );
  const [selectedStudent, setSelectedStudent] = useState<LecturerData | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAlertApprove, setIsAlertApprove] = useState(false);
  const [isAlertReject, setIsAlertReject] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [currentData, setCurrentData] = useState<LecturerData[] | null>(null);
  const [filteredData, setFilteredData] = useState<LecturerData[] | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    filteringData();
  }, [data, searchTerm, currentPage, itemsPerPage]);

  const filteringData = () => {
    if (data) {
      // Filter data based on search term
      let filteredData = pengajuanData?.filter((fp) => {
        if (
          fp.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fp.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fp.lecturer_code.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
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

  const handleDetailOpen = (lc: LecturerData) => {
    setSelectedStudent(lc);
    setIsDetailModalOpen(true);
  };

  const handlePembimbing = (code: any, p: any) => {
    window.location.href = `/admin/tugas-akhir/pengajuan?c=${code}&p=${p}`;
  };
  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedStudent(null);
  };

  const handleApproveBatch = async () => {
    if (selectedStudent) {
      try {
        const response = await onApproval(selectedStudent.id);
        if (response.ok) {
          // Update local state to reflect the change
          window.location.reload();
        }
      } catch (error) {
        console.error("Error approving student:", error);
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
      />

      {/* Alert */}
      <Alert
        isOpen={isAlertApprove}
        onClose={() => setIsAlertApprove(false)}
        onConfirm={handleApproveBatch}
      />

      {/* Table Section */}
      <section className="content-section p-2 w-full">
        {/* Search Input */}
        <div className="mb-6 p-4">
          <input
            type="text"
            placeholder="Cari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
                  Kode Dosen
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  Pembimbing 1
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  Pembimbing 2
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle"
                ></th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terisi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slot
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terisi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slot
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentData &&
                currentData.map((lc) => (
                  <tr key={lc.id} className="hover:bg-gray-50 cursor-pointer">
                    {/* Nama */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {lc.user.name}
                        <div className="text-xs text-gray-500">{lc.nip}</div>
                      </div>
                    </td>
                    {/* Kode Dosen */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {lc.lecturer_code}
                    </td>
                    {/* Pembimbing 1 - Terisi */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {lc.current_supervised_1}
                    </td>
                    {/* Pembimbing 1 - Slot */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {lc.max_supervised_1 - lc.current_supervised_1}
                    </td>
                    {/* Pembimbing 2 - Terisi */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {lc.current_supervised_2}
                    </td>
                    {/* Pembimbing 2 - Slot */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {lc.max_supervised_2 - lc.current_supervised_2}
                    </td>
                    {/* action buttons */}
                    <td className="flex justify-center items-center gap-3 px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center flex-col gap-2">
                        <ButtonActions
                          className="!bg-purple-300 !text-purple-700 hover:!bg-purple-400"
                          onClick={() => {
                            handlePembimbing(lc.lecturer_code, "1");
                          }}
                        >
                          Pembimbing 1
                        </ButtonActions>
                        <ButtonActions
                          className="!bg-blue-300 !text-blue-700 hover:!bg-blue-400"
                          onClick={() => {
                            handlePembimbing(lc.lecturer_code, "2");
                          }}
                        >
                          Pembimbing 2
                        </ButtonActions>
                      </div>
                      {/* <div className="">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-md bg-secondary border border-black-300 hover:bg-gray-background hover:text-black cursor-pointer">
                              <MoreHorizontalIcon size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                className="text-green-600 cursor-pointer focus:bg-green-100 data-[highlighted]:bg-green-100 data-[highlighted]:text-green-700"
                                onClick={() => {
                                  setSelectedStudent(lc);
                                  setIsAlertApprove(true);
                                }}
                              >
                                Setujui Batch
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div> */}
                    </td>
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
