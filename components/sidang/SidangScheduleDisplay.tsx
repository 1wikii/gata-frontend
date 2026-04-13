"use client";

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Upload, AlertCircle, CheckCircle, X } from "lucide-react";
import {
  SidangScheduleRow,
  SidangScheduleRequest,
  groupSchedulesByDate,
  sortGroupedSchedules,
} from "@/utils/sidangScheduleParser";
import SidangScheduleGroupTable from "./SidangScheduleGroupTable";
import { api } from "@/utils/api";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { set } from "react-hook-form";

const SidangScheduleDisplay = () => {
  const [displaySchedules, setDisplaySchedules] = useState<SidangScheduleRow[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [belumTerjadwalData, setBelumTerjadwalData] = useState<any[]>([]);
  const [pengujiData, setPengujiData] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedPengajuan, setSelectedPengajuan] = useState<string>("");
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(
    null
  );
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  // Form state
  const [tanggal, setTanggal] = useState("");
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [type, setType] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [judul, setJudul] = useState("");
  const [nim, setNim] = useState("");
  const [namaMahasiswa, setNamaMahasiswa] = useState("");
  const [capstone, setCapstone] = useState("");
  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [penguji1, setPenguji1] = useState("");
  const [penguji2, setPenguji2] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // load data dari api
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/jadwal-sidang");
        const result = await response.json();

        if (response.ok && result.data) {
          // Ensure each schedule has an id
          const schedulesWithId = result.data.map(
            (schedule: any, index: number) => ({
              ...schedule,
              id: schedule.id || schedule.schedule_id || index + 1,
            })
          );
          console.log("Loaded schedules:", schedulesWithId);
          setDisplaySchedules(schedulesWithId);
        }
      } catch (err) {
        setError("Gagal memuat jadwal. Silahkan coba lagi nanti.");
      }
    };
    fetchSchedules();

    // Fetch belum terjadwal data
    const fetchBelumTerjadwal = async () => {
      try {
        const response = await api.get("/admin/defense/belum-terjadwal");
        const result = await response.json();

        if (response.ok && result.data) {
          setBelumTerjadwalData(result.data);
        }
      } catch (err) {
        console.error("Gagal memuat data belum terjadwal:", err);
      }
    };
    fetchBelumTerjadwal();

    // Fetch penguji data
    const fetchPenguji = async () => {
      try {
        const response = await api.get("/admin/defense/penguji");
        const result = await response.json();

        if (response.ok && result.data) {
          setPengujiData(result.data);
        }
      } catch (err) {
        console.error("Gagal memuat data penguji:", err);
      }
    };
    fetchPenguji();
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingScheduleId(null);
    setSelectedPengajuan("");
    setTanggal("");
    setMulai("");
    setSelesai("");
    setType("Proposal");
    setLokasi("");
    setJudul("");
    setNim("");
    setNamaMahasiswa("");
    setCapstone("");
    setPembimbing1("");
    setPembimbing2("");
    setPenguji1("");
    setPenguji2("");
    setFormErrors({});
  };

  const handlePengajuanChange = (pengajuanId: string) => {
    setSelectedPengajuan(pengajuanId);

    if (pengajuanId) {
      const selected = belumTerjadwalData.find(
        (item) => `${item.nim}-${item.name}` === pengajuanId
      );

      if (selected) {
        setNim(selected.nim);
        setNamaMahasiswa(selected.name);
        setJudul(selected.judul);
        setType(selected.tipeSidang);
        setPembimbing1(selected.pembimbing1);
        setPembimbing2(selected.pembimbing2);
        setPenguji1(selected.penguji1);
        setPenguji2(selected.penguji2);
        setCapstone("");
      }
    } else {
      setNim("");
      setNamaMahasiswa("");
      setJudul("");
      setType("Proposal");
      setPembimbing1("");
      setPembimbing2("");
      setPenguji1("");
      setPenguji2("");
      setCapstone("");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tanggal) newErrors.tanggal = "Tanggal harus diisi";
    if (!type) newErrors.type = "Tipe harus diisi";
    if (!mulai) newErrors.mulai = "Waktu mulai harus diisi";
    if (!selesai) newErrors.selesai = "Waktu selesai harus diisi";
    if (!lokasi) newErrors.lokasi = "Lokasi harus diisi";

    if (mulai && selesai) {
      const [startHour, startMin] = mulai.split(":").map(Number);
      const [endHour, endMin] = selesai.split(":").map(Number);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;

      if (startTotal >= endTotal) {
        newErrors.selesai = "Waktu selesai harus lebih besar dari waktu mulai";
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoadingSubmit(true);
      try {
        let payload: any;

        if (editingScheduleId) {
          // EDIT: tidak perlu pengajuanId, hanya update fields yang bisa diubah
          payload = {
            tanggal,
            mulai,
            selesai,
            type,
            lokasi,
            judul,
            nim,
            namaMahasiswa,
            capstone,
            pembimbing1,
            pembimbing2,
            penguji1,
            penguji2,
          };

          const response = await api.put(
            `/admin/defense/edit/${editingScheduleId}`,
            payload
          );
          const result = await response.json();

          if (response.ok) {
            alert("Jadwal berhasil diupdate!");
            closeDialog();
            // Refresh schedules
            const refreshResponse = await api.get("/jadwal-sidang");
            const refreshResult = await refreshResponse.json();
            if (refreshResponse.ok && refreshResult.data) {
              setDisplaySchedules(refreshResult.data);
            }
          } else {
            alert(result.message || "Gagal mengupdate jadwal!");
          }
        } else {
          // CREATE: perlu pengajuanId
          const selectedData = belumTerjadwalData.find(
            (item) => `${item.nim}-${item.name}` === selectedPengajuan
          );

          if (!selectedData) {
            alert("Data pengajuan tidak ditemukan!");
            setIsLoadingSubmit(false);
            return;
          }

          payload = {
            pengajuanId: selectedData.id,
            tanggal,
            mulai,
            selesai,
            type,
            lokasi,
            judul,
            nim,
            namaMahasiswa,
            capstone,
            pembimbing1,
            pembimbing2,
            penguji1,
            penguji2,
          };

          const response = await api.post("/admin/defense/tambah", payload);
          const result = await response.json();

          if (response.ok) {
            alert("Jadwal berhasil ditambahkan!");
            closeDialog();
            // Refresh schedules
            const refreshResponse = await api.get("/jadwal-sidang");
            const refreshResult = await refreshResponse.json();
            if (refreshResponse.ok && refreshResult.data) {
              setDisplaySchedules(refreshResult.data);
            }
          } else {
            alert(result.message || "Gagal menambahkan jadwal!");
          }
        }
      } catch (err) {
        console.error("Error saving schedule:", err);
        alert("Terjadi kesalahan saat menyimpan jadwal!");
      } finally {
        setIsLoadingSubmit(false);
        setSelectedPengajuan("");
      }
    }
  };

  const handleEdit = (schedule: SidangScheduleRow) => {
    setSelectedPengajuan("*"); // Reset pengajuan selection
    setEditingScheduleId(schedule.id);
    setTanggal(schedule.date);
    setMulai(schedule.startTime);
    setSelesai(schedule.endTime);
    setType(schedule.type);
    setLokasi(schedule.location);
    setJudul(schedule.judul);
    setNim(schedule.nim);
    setNamaMahasiswa(schedule.name);
    setCapstone(schedule.capstone_code || "");
    setPembimbing1(schedule.spv_1);
    setPembimbing2(schedule.spv_2);
    setPenguji1(schedule.examiner_1);
    setPenguji2(schedule.examiner_2);
    setDialogOpen(true);
  };

  const handleDelete = (scheduleId: number) => {
    console.log("Delete requested for schedule ID:", scheduleId);
    if (!scheduleId) {
      alert("Error: ID jadwal tidak ditemukan");
      return;
    }
    setScheduleToDelete(scheduleId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      const response = await api.delete(
        `/admin/defense/hapus/${scheduleToDelete}`
      );
      const result = await response.json();

      if (response.ok) {
        alert("Jadwal berhasil dihapus!");
        setDeleteDialogOpen(false);
        setScheduleToDelete(null);
        // Refresh schedules
        const refreshResponse = await api.get("/jadwal-sidang");
        const refreshResult = await refreshResponse.json();
        if (refreshResponse.ok && refreshResult.data) {
          setDisplaySchedules(refreshResult.data);
        }
      } else {
        alert(result.message || "Gagal menghapus jadwal!");
      }
    } catch (err) {
      console.error("Error deleting schedule:", err);
      alert("Terjadi kesalahan saat menghapus jadwal!");
    }
  };

  const handleCreateNew = () => {
    // Reset ke CREATE mode
    setEditingScheduleId(null);
    setSelectedPengajuan("");
    setTanggal("");
    setMulai("");
    setSelesai("");
    setType("Proposal");
    setLokasi("");
    setJudul("");
    setNim("");
    setNamaMahasiswa("");
    setCapstone("");
    setPembimbing1("");
    setPembimbing2("");
    setPenguji1("");
    setPenguji2("");
    setFormErrors({});
    setDialogOpen(true);
  };

  // Group dan sort schedules
  const grouped = groupSchedulesByDate(displaySchedules);
  const sortedGroups = sortGroupedSchedules(grouped);

  // Hitung statistik
  const totalSchedules = displaySchedules.length;
  const totalDates = sortedGroups.length;
  const proposalCount = displaySchedules.filter((s) =>
    s.type.toLowerCase().includes("proposal")
  ).length;
  const sidangCount = displaySchedules.filter(
    (s) => !s.type.toLowerCase().includes("proposal")
  ).length;

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Hapus Jadwal Sidang?"
        description="Apakah Anda yakin ingin menghapus jadwal sidang ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Dialog untuk tambah jadwal */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent
          className="fixed !top-[5%] left-1/2 -translate-x-1/2 !translate-y-0 
                !max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg"
        >
          <AlertDialogTitle className="sr-only"></AlertDialogTitle>
          <AlertDialogDescription className="sr-only"></AlertDialogDescription>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingScheduleId === null ? "Tambah Jadwal" : "Edit Jadwal"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {editingScheduleId === null
                  ? "Isi formulir untuk menjadwalkan sidang mahasiswa"
                  : "Update informasi jadwal sidang mahasiswa"}
              </p>
            </div>
            <button
              onClick={closeDialog}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6 py-4">
            {/* PILIH PENGAJUAN SIDANG - Hanya tampil saat CREATE (editingScheduleId === null) */}
            {editingScheduleId === null && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="space-y-2">
                  <Label
                    htmlFor="pengajuan"
                    className="text-gray-700 font-semibold"
                  >
                    Pilih Pengajuan Sidang
                  </Label>
                  <Select
                    value={selectedPengajuan}
                    onValueChange={handlePengajuanChange}
                  >
                    <SelectTrigger id="pengajuan" className="w-full">
                      <SelectValue placeholder="Pilih pengajuan sidang" />
                    </SelectTrigger>
                    <SelectContent>
                      {belumTerjadwalData.map((item) => (
                        <SelectItem
                          key={`${item.nim}-${item.name}`}
                          value={`${item.nim}-${item.name}`}
                        >
                          {item.nim} - {item.name} ({item.tipeSidang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* INFORMASI JADWAL */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
                Informasi Jadwal
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Tanggal */}
                <div className="space-y-2">
                  <Label
                    htmlFor="tanggal"
                    className="text-gray-700 font-semibold"
                  >
                    Tanggal
                  </Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className={formErrors.tanggal ? "border-red-500" : ""}
                    placeholder="mm/dd/yyyy"
                    disabled={false}
                  />
                  {formErrors.tanggal && (
                    <p className="text-xs text-red-600">{formErrors.tanggal}</p>
                  )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700 font-semibold">
                    Type
                  </Label>
                  <Select value={type} onValueChange={setType} disabled={false}>
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Sidang">Sidang</SelectItem>
                    </SelectContent>
                  </Select>

                  {formErrors.type && (
                    <p className="text-xs text-red-600">{formErrors.type}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Mulai */}
                <div className="space-y-2">
                  <Label
                    htmlFor="mulai"
                    className="text-gray-700 font-semibold"
                  >
                    Mulai
                  </Label>
                  <Input
                    id="mulai"
                    type="time"
                    value={mulai}
                    onChange={(e) => setMulai(e.target.value)}
                    className={formErrors.mulai ? "border-red-500" : ""}
                    placeholder="--:-- --"
                    disabled={false}
                  />
                  {formErrors.mulai && (
                    <p className="text-xs text-red-600">{formErrors.mulai}</p>
                  )}
                </div>

                {/* Selesai */}
                <div className="space-y-2">
                  <Label
                    htmlFor="selesai"
                    className="text-gray-700 font-semibold"
                  >
                    Selesai
                  </Label>
                  <Input
                    id="selesai"
                    type="time"
                    value={selesai}
                    onChange={(e) => setSelesai(e.target.value)}
                    className={formErrors.selesai ? "border-red-500" : ""}
                    placeholder="--:-- --"
                    disabled={false}
                  />
                  {formErrors.selesai && (
                    <p className="text-xs text-red-600">{formErrors.selesai}</p>
                  )}
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="lokasi" className="text-gray-700 font-semibold">
                  Lokasi
                </Label>
                <Input
                  id="lokasi"
                  type="text"
                  placeholder="Ruang, Gedung, atau Link"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className={formErrors.lokasi ? "border-red-500" : ""}
                  disabled={false}
                />
                {formErrors.lokasi && (
                  <p className="text-xs text-red-600">{formErrors.lokasi}</p>
                )}
              </div>

              {/* Judul */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="judul" className="text-gray-700 font-semibold">
                  Judul
                </Label>
                <Input
                  id="judul"
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  disabled={false}
                  className=""
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* NIM */}
                <div className="space-y-2">
                  <Label htmlFor="nim" className="text-gray-700 font-semibold">
                    NIM
                  </Label>
                  <Input
                    id="nim"
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    disabled={false}
                    className=""
                  />
                </div>

                {/* Nama Mahasiswa */}
                <div className="space-y-2">
                  <Label
                    htmlFor="namaMahasiswa"
                    className="text-gray-700 font-semibold"
                  >
                    Nama Mahasiswa
                  </Label>
                  <Input
                    id="namaMahasiswa"
                    type="text"
                    value={namaMahasiswa}
                    onChange={(e) => setNamaMahasiswa(e.target.value)}
                    disabled={false}
                    className=""
                  />
                </div>

                {/* Capstone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="capstone"
                    className="text-gray-700 font-semibold"
                  >
                    Capstone
                  </Label>
                  <Input
                    id="capstone"
                    type="text"
                    placeholder=""
                    value={capstone}
                    onChange={(e) => setCapstone(e.target.value)}
                    disabled={false}
                  />
                </div>
              </div>
            </div>

            {/* DOSEN */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
                Dosen
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Pembimbing 1 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="pembimbing1"
                    className="text-gray-700 font-semibold"
                  >
                    Pembimbing 1
                  </Label>
                  <Input
                    id="pembimbing1"
                    type="text"
                    value={pembimbing1}
                    onChange={(e) => setPembimbing1(e.target.value)}
                    disabled={true}
                    className="bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">-</p>
                </div>

                {/* Pembimbing 2 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="pembimbing2"
                    className="text-gray-700 font-semibold"
                  >
                    Pembimbing 2
                  </Label>
                  <Input
                    id="pembimbing2"
                    type="text"
                    value={pembimbing2}
                    onChange={(e) => setPembimbing2(e.target.value)}
                    disabled={true}
                    className="bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">-</p>
                </div>

                {/* Penguji 1 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="penguji1"
                    className="text-gray-700 font-semibold"
                  >
                    Penguji 1
                  </Label>
                  {penguji1 && penguji1 !== "-" ? (
                    <>
                      <Input
                        id="penguji1"
                        type="text"
                        value={penguji1}
                        disabled={true}
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">-</p>
                    </>
                  ) : (
                    <>
                      <Select
                        value={penguji1}
                        onValueChange={setPenguji1}
                        disabled={false}
                      >
                        <SelectTrigger id="penguji1" className="w-full">
                          <SelectValue placeholder="Pilih penguji 1" />
                        </SelectTrigger>
                        <SelectContent>
                          {pengujiData.map((penguji) => (
                            <SelectItem key={penguji.id} value={penguji.name}>
                              {penguji.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                {/* Penguji 2 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="penguji2"
                    className="text-gray-700 font-semibold"
                  >
                    Penguji 2
                  </Label>
                  {penguji2 && penguji2 !== "-" ? (
                    <>
                      <Input
                        id="penguji2"
                        type="text"
                        value={penguji2}
                        disabled={true}
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">-</p>
                    </>
                  ) : (
                    <>
                      <Select
                        value={penguji2}
                        onValueChange={setPenguji2}
                        disabled={false}
                      >
                        <SelectTrigger id="penguji2" className="w-full">
                          <SelectValue placeholder="Pilih penguji 2" />
                        </SelectTrigger>
                        <SelectContent>
                          {pengujiData.map((penguji) => (
                            <SelectItem key={penguji.id} value={penguji.name}>
                              {penguji.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex gap-3">
            <button
              onClick={closeDialog}
              disabled={isLoadingSubmit}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={
                isLoadingSubmit || (!editingScheduleId && !selectedPengajuan)
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingSubmit
                ? "Menyimpan..."
                : editingScheduleId === null
                ? "Tambah"
                : "Update"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900">Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {displaySchedules.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Jadwal
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {totalSchedules}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Tanggal Pelaksanaan
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {totalDates}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sidang Proposal
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {proposalCount}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sidang Akhir
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {sidangCount}
            </p>
          </div>
        </div>
      )}

      {/* Schedule Display */}
      {displaySchedules.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Kelola Jadwal
              </h2>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                <span className="text-lg">+</span>
                <span>Jadwal Baru</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Menampilkan {totalSchedules} dari {totalSchedules} jadwal
            </p>

            {displaySchedules.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <SidangScheduleGroupTable
                  schedules={displaySchedules}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Tidak ada jadwal yang tersedia untuk ditampilkan.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {displaySchedules.length === 0 && !error && (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Jadwal
          </h3>
          <p className="text-gray-600">
            Silahkan lakukan penjadwalan sidang terlebih dahulu.
          </p>
        </div>
      )}
    </div>
  );
};

SidangScheduleDisplay.displayName = "SidangScheduleDisplay";

export default SidangScheduleDisplay;
