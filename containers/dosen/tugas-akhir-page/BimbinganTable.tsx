"use client";

import { useEffect, useState } from "react";
import { Check, X, CircleDot } from "lucide-react";
import { BlueDark, PurpleMedium } from "@/components/buttons/status";
import AlertApproval from "@/components/popup/approval";
import Alert from "@/components/popup/errorFromApi";
import PopupNote from "@/components/popup/inputNote";

import DetailBimbinganModal from "@/containers/dosen/tugas-akhir-page/DetailBimbinganModal";
import ButtonActions from "@/components/buttons/table-actions/index";
import { FPApprovalRequest } from "@/types/dosen";

interface Props {
  isPeriod: boolean;
  validationData: StudentData[];
  onApproval: (data: FPApprovalRequest) => Promise<any>;
}

export interface StudentData {
  id: number;
  type: string;
  status: string;
  source_topic: string;
  created_at: string;
  supervisor_1_status: "pending" | "approved" | "rejected";
  supervisor_2_status: "pending" | "approved" | "rejected";
  supervisor_choices: "all" | "1" | "2" | string;
  supervisor_status: "all" | "pending" | "approved" | "rejected" | string;
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

const BimbinganTable: React.FC<Props> = ({
  isPeriod,
  validationData,
  onApproval,
}) => {
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
  const [validationRows, setValidationRows] = useState<StudentData[] | null>(
    validationData
  );
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StudentData["supervisor_status"]>("pending");
  const [pilihanPembimbingFilter, setPilihanPembimbingFilter] =
    useState<StudentData["supervisor_choices"]>("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAlertApprove, setIsAlertApprove] = useState(false);
  const [isAlertReject, setIsAlertReject] = useState(false);
  const [AlertError, setAlertError] = useState({ isOpen: false, message: "" });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [currentData, setCurrentData] = useState<StudentData[] | null>(null);
  const [filteredData, setFilteredData] = useState<StudentData[] | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pilihanPembimbingFilter]);

  useEffect(() => {
    filteringData();
  }, [
    validationData,
    searchTerm,
    statusFilter,
    pilihanPembimbingFilter,
    currentPage,
    itemsPerPage,
  ]);

  const filteringData = () => {
    if (validationData) {
      // Filter data based on search and status
      let filteredData = validationRows?.filter((student) => {
        const matchesSearch = student.members.some(
          (anggota) =>
            anggota.student.user.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            anggota.student.nim
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            anggota.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.type.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesStatus =
          statusFilter === "all" || student.supervisor_status === statusFilter;
        const matchesPilihanPembimbing =
          pilihanPembimbingFilter === "all" ||
          student.supervisor_choices === pilihanPembimbingFilter;

        return matchesSearch && matchesStatus && matchesPilihanPembimbing;
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

  const handleDetailOpen = (student: StudentData) => {
    setSelectedStudent(student);
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
          supervisor_choices: selectedStudent.supervisor_choices,
          note: null,
        };
        const response = await onApproval(data);

        if (response.ok) {
          // Update local state to reflect the change
          window.location.reload();
        } else {
          const result = await response.json();
          if (result.errors) {
            setAlertError({ isOpen: true, message: result.errors.msg });
          }
        }
      } catch (error) {
        console.error("Error approving student:", error);
      }
    }
  };
  const handleReject = async (note: string) => {
    if (selectedStudent) {
      try {
        const data: FPApprovalRequest = {
          fpId: selectedStudent.id,
          status: "rejected",
          supervisor_choices: selectedStudent.supervisor_choices,
          note: note,
        };
        const response = await onApproval(data);

        if (response.ok) {
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
      <DetailBimbinganModal
        isPeriod={isPeriod}
        isOpen={isDetailModalOpen}
        onClose={handleDetailClose}
        data={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        setAlertApprove={setIsAlertApprove}
        setAlertReject={setIsAlertReject}
      />

      {/* Alert Approval */}
      <AlertApproval
        isOpen={isAlertApprove}
        onClose={() => setIsAlertApprove(false)}
        onConfirm={handleApprove}
      />

      {/* input Note jika tolak */}
      <PopupNote
        isOpen={isAlertReject}
        onClose={() => setIsAlertReject(false)}
        title="Alasan Penolakan"
        onConfirm={handleReject}
      />

      {/* error from API */}
      <Alert
        isOpen={AlertError.isOpen}
        onClose={() => setAlertError({ isOpen: false, message: "" })}
        message={AlertError.message}
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
          {/* Pilihan Pembimbing Filter */}
          <div className="flex gap-2">
            <select
              value={pilihanPembimbingFilter}
              onChange={(e) => setPilihanPembimbingFilter(e.target.value)}
              className="bg-secondary px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Pembimbing</option>
              <option value="1">Pembimbing 1</option>
              <option value="2">Pembimbing 2</option>
            </select>
          </div>
        </div>

        {/* Table Container with Scroll */}
        <div className="overflow-y-auto max-h-[700px] rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe <br /> Tugas Akhir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pilihan <br /> Pembimbing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                    <td className="px-6 py-4">
                      {student.type === "regular" ? (
                        <BlueDark text="Reguler" />
                      ) : (
                        <PurpleMedium text="Capstone" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.supervisor_choices === "1" ? (
                        <BlueDark text="Pembimbing 1" />
                      ) : (
                        <PurpleMedium text="Pembimbing 2" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          student.supervisor_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.supervisor_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                      >
                        {student.supervisor_status === "pending"
                          ? "Menunggu"
                          : student.supervisor_status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                      </span>
                    </td>

                    {/* action buttons */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <ButtonActions
                          onClick={() => handleDetailOpen(student)}
                        >
                          <CircleDot className="w-3 h-3" />
                        </ButtonActions>
                        {(isPeriod &&
                          student.supervisor_choices === "1" &&
                          student.supervisor_1_status === "pending") ||
                        (isPeriod &&
                          student.supervisor_choices === "2" &&
                          student.supervisor_2_status === "pending") ? (
                          <>
                            <ButtonActions
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(student);
                                setIsAlertReject(true);
                              }}
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </ButtonActions>
                            <ButtonActions
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(student);
                                setIsAlertApprove(true);
                              }}
                            >
                              <Check className="w-3 h-3 text-green-600" />
                            </ButtonActions>
                          </>
                        ) : null}
                      </div>
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

export default BimbinganTable;
