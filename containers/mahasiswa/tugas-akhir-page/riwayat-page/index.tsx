"use client";

import React, { use, useEffect, useState } from "react";
import {
  FileText,
  Download,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import NotSignUp from "@/components/ui/error/student-not-final-project";
import Loading from "@/components/ui/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AlertSure from "@/components/popup/approval";
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
import { formatDate, capitalize1st } from "@/utils/strHelper";
import { FPChangeLecturer } from "@/types/mahasiswa";

interface Props {
  getFinalProjectHistory: () => Promise<any>;
  getLecturer: () => Promise<any>;
  onChangeSupervisor: (data: FPChangeLecturer) => Promise<any>;
  onDeleteFinalProject: (fpId: number) => Promise<any>;
}

interface Data {
  id: number;
  type: string;
  status: string;
  source_topic: string;
  supervisor_1_status: string;
  supervisor_2_status: string;
  admin_status: string;
  supervisor_1_note: string | null;
  supervisor_2_note: string | null;
  created_at: string;
  supervisor_1: { id: number; user: { id: number; name: string } };
  supervisor_2: { id: number; user: { id: number; name: string } } | null;
  students: Array<{
    id: number;
    nim: string;
    user: { id: number; name: string };
  }>;
  members: Member[];
  documents: Documents[];
}

interface Member {
  id: number;
  title: string;
  resume: string;
  created_at: string;
}
interface Documents {
  id: number;
  draft_path: string;
  draft_filename: string;
  draft_size: string;
  dispen_path: string;
  dispen_filename: string;
  dispen_size: string;
  created_at: string;
}

interface LecturerData {
  id: number;
  name: string;
  email: string;
  lecturer: {
    id: number;
    current_supervised_1: number;
    current_supervised_2: number;
    max_supervised_1: number;
    max_supervised_2: number;
  };
}

const ThesisSubmissionDetail: React.FC<Props> = ({
  getFinalProjectHistory,
  getLecturer,
  onChangeSupervisor,
  onDeleteFinalProject,
}) => {
  const [showResume, setShowResume] = useState(false);
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChangeSupervisorModal, setShowChangeSupervisorModal] =
    useState(false);
  const [isDelete, setIsDelete] = useState({ open: false, fpId: 0 });
  const [selectedSupervisor1, setSelectedSupervisor1] = useState<number | null>(
    null
  );
  const [selectedSupervisor2, setSelectedSupervisor2] = useState<number | null>(
    null
  );

  useEffect(() => {
    getFinalProjectHistory()
      .then((result) => {
        if (result && result.data) {
          setData(result.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching final project history:", error);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

    getLecturer()
      .then((result) => {
        if (result && result.data) {
          setLecturers(result.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching lecturers:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    filterLecturer();
  }, [data]);

  const handleDownload = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

    const downloadUrl = `${baseUrl}/${path}`;
    window.open(downloadUrl, "_blank");
  };

  const filterLecturer = () => {
    let idToRemove = 0;

    if (data) {
      if (data.supervisor_1_status === "rejected") {
        idToRemove = data.supervisor_1.user.id;
      } else if (data.supervisor_2 && data.supervisor_2_status === "rejected") {
        idToRemove = data.supervisor_2.user.id;
      }
    }

    setLecturers((prev) =>
      prev.filter((lecturer) => lecturer.id !== idToRemove)
    );
  };

  const handleChangeSupervisor = () => {
    setShowChangeSupervisorModal(true);
  };

  const handleDelete = async () => {
    const response = await onDeleteFinalProject(isDelete.fpId);

    if (response.ok) {
      window.location.href = "/mahasiswa/tugas-akhir/daftar";
    }
  };

  const handleSubmitChangeSupervisor = async () => {
    if (!data) return;

    const response = await onChangeSupervisor({
      fpId: data.id,
      supervisor_1: selectedSupervisor1,
      supervisor_2: selectedSupervisor2,
    });

    if (response.ok) {
      window.location.reload();
    }
    setShowChangeSupervisorModal(false);
    setSelectedSupervisor1(null);
    setSelectedSupervisor2(null);
  };

  const handleCloseModal = () => {
    setSelectedSupervisor1(null);
    setSelectedSupervisor2(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !data) {
    return <NotSignUp />;
  }

  return (
    data &&
    data.members.map((m: Member) => (
      <div key={m.id} className="main-container p-2 md:p-5">
        {/* Alert */}
        <AlertSure
          isOpen={isDelete.open}
          onClose={() => setIsDelete({ open: false, fpId: 0 })}
          onConfirm={handleDelete}
        />

        <div className="mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 break-all whitespace-normal w-full block">
              {m.title}
            </h1>

            {/* Action Buttons */}
            {data.admin_status === "rejected" && (
              <div className="flex justify-end gap-3 mb-4">
                <button
                  onClick={handleChangeSupervisor}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <span>Ganti Pembimbing</span>
                </button>
                <button
                  onClick={() => setIsDelete({ open: true, fpId: data.id })}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <span>Hapus</span>
                </button>
              </div>
            )}

            {/* Resume Kebaharuan */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resume Kebaharuan
                </h2>
                <button
                  onClick={() => setShowResume(!showResume)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium">Baca Selengkapnya</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showResume ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <p
                className={`text-gray-600 text-sm leading-relaxed break-all whitespace-pre-wrap w-full block overflow-hidden ${
                  showResume ? "" : "max-h-[4.5rem]"
                }`}
              >
                {m.resume}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detail Pendaftaran */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Detail Pendaftaran
                </h2>

                {/* Status Alerts */}
                <div className="space-y-4">
                  {data.admin_status === "pending" ? (
                    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                      <Info className="w-10 h-10 text-yellow-600" />
                      <AlertTitle className="text-lg">
                        Status Pendaftaran: Menunggu Persetujuan
                      </AlertTitle>
                      <AlertDescription>
                        Pendaftaran Anda sedang menunggu persetujuan dari admin.
                        Harap tunggu proses selanjutnya.
                      </AlertDescription>
                    </Alert>
                  ) : data.admin_status === "rejected" ? (
                    <>
                      <Alert className="bg-red-50 border-red-200 text-red-800">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                        <AlertTitle className="text-lg">
                          Status Pendaftaran: Ditolak
                        </AlertTitle>
                        <AlertDescription>
                          Pendaftaran Anda telah ditolak. Silakan periksa
                          catatan dari pembimbing untuk informasi lebih lanjut.
                        </AlertDescription>
                      </Alert>
                      <div className="grid grid-rows-2 mt-4 space-y-3">
                        <p className="row-span-2 text-sm font-semibold text-red-900 mb-3">
                          Catatan Penolakan:
                        </p>

                        <div className="row-span-1 grid grid-cols-2 gap-6">
                          {/* Catatan Pembimbing 1 */}
                          <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-red-700">
                                  P1
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                  Pembimbing 1
                                </p>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                  {data.supervisor_1_note
                                    ? data.supervisor_1_note
                                    : "Tidak ada catatan"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Catatan Pembimbing 2 */}
                          <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-red-700">
                                  P2
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                  Pembimbing 2
                                </p>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                  {data.supervisor_2_note
                                    ? data.supervisor_2_note
                                    : "Tidak ada catatan"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : data.admin_status === "approved" ? (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                      <AlertTitle className="text-lg">
                        Status Pendaftaran: Disetujui
                      </AlertTitle>
                      <AlertDescription>
                        Pendaftaran Anda telah disetujui. Silakan lanjut ke
                        tahap berikutnya.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tanggal Pendaftaran */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Tanggal Pendaftaran
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(data.created_at).tanggal}
                    </p>
                  </div>

                  {/* Tipe Tugas Akhir */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Tipe Tugas Akhir
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          data.type === "regular"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {capitalize1st(data.type)}
                      </span>
                    </div>
                  </div>

                  {/* Dosen Pembimbing 1 */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Dosen Pembimbing 1
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                      {data.supervisor_1.user.name}
                    </p>
                  </div>

                  {/* Dosen Pembimbing 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Dosen Pembimbing 2
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                      {data.supervisor_2 ? data.supervisor_2.user.name : "-"}
                    </p>
                  </div>

                  {/* Status Tugas Akhir */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Status Tugas Akhir
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          data.status === "baru"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {capitalize1st(data.status)}
                      </span>
                    </div>
                  </div>

                  {/* Sumber Topik */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Sumber Topik
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                      {capitalize1st(data.source_topic)}
                    </p>
                  </div>
                </div>

                {/* Mahasiswa  */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {data.type === "regular" ? "Mahasiswa" : "Anggota Capstone"}
                  </h3>

                  <div className="divide-y divide-gray-100">
                    {data.students.map((member: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 px-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {member.user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {member.nim}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 italic">
                            {data.type === "regular"
                              ? capitalize1st(data.type)
                              : `Anggota ${index + 1}`}
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dokumen Pendaftaran */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Dokumen Pendaftaran
                </h2>

                <div className="overflow-auto lg:max-h-[700px]">
                  {data.documents.map((doc: Documents) => (
                    <div key={doc.id} className="space-y-4 mb-4">
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 hover:border-blue-500">
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {doc.draft_filename}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {doc.draft_size} MB
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Diupload:{" "}
                              {formatDate(doc.created_at).tanggal + ", "}
                              {formatDate(doc.created_at).waktu}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(doc.draft_path)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>

                      {doc.dispen_path && (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 hover:border-blue-500">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm truncate">
                                {doc.dispen_filename}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {doc.dispen_size} MB
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Diupload:{" "}
                                {formatDate(doc.created_at).tanggal + ", "}
                                {formatDate(doc.created_at).waktu}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(doc.dispen_path)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Supervisor Modal */}
        <AlertDialog
          open={showChangeSupervisorModal}
          onOpenChange={setShowChangeSupervisorModal}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Ganti Pembimbing</AlertDialogTitle>
              <AlertDialogDescription>
                Pilih pembimbing baru untuk menggantikan pembimbing yang menolak
                pendaftaran Anda.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              {/* Supervisor 1 Select - Show if supervisor 1 is rejected */}
              {data.supervisor_1_status === "rejected" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pembimbing 1 Baru
                  </label>
                  <select
                    value={selectedSupervisor1 || ""}
                    onChange={(e) =>
                      setSelectedSupervisor1(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Pilih Pembimbing 1
                    </option>
                    {lecturers.map((lecturer) => (
                      <option
                        key={lecturer.lecturer.id}
                        value={lecturer.lecturer.id}
                      >
                        {lecturer.name} - (
                        {lecturer.lecturer.current_supervised_1}/
                        {lecturer.lecturer.max_supervised_1})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Supervisor 2 Select - Show if supervisor 2 is rejected */}
              {data.supervisor_2_status === "rejected" && data.supervisor_2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pembimbing 2 Baru
                  </label>
                  <select
                    value={selectedSupervisor2 || ""}
                    onChange={(e) =>
                      setSelectedSupervisor2(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Pilih Pembimbing 2
                    </option>
                    {lecturers.map((lecturer) => (
                      <option
                        key={lecturer.lecturer.id}
                        value={lecturer.lecturer.id}
                      >
                        {lecturer.name} - (
                        {lecturer.lecturer.current_supervised_2}/
                        {lecturer.lecturer.max_supervised_2})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseModal}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitChangeSupervisor}
                disabled={
                  (data.supervisor_1_status === "rejected" &&
                    !selectedSupervisor1) ||
                  (data.supervisor_2_status === "rejected" &&
                    !selectedSupervisor2)
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                Simpan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ))
  );
};

export default ThesisSubmissionDetail;
