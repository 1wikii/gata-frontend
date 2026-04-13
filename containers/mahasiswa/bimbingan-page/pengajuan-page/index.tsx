"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DosenOption,
  PengajuanBimbinganForm,
} from "@/types/bimbingan-mahasiswa";
import { getDayName, DaysType } from "@/utils/dateHelper";
import {
  User,
  Calendar,
  Clock,
  FileText,
  Plus,
  Trash2,
  Send,
  Link as LinkIcon,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Props {
  getSupervisor: () => Promise<any>;
  onCreate: (data: PengajuanBimbinganForm) => Promise<any>;
}

const PengajuanPage: React.FC<Props> = ({ getSupervisor, onCreate }) => {
  const [supervisorList, setSupervisorList] = useState<DosenOption[]>([]);
  const [selectedDosenId, setSelectedDosenId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PengajuanBimbinganForm>({
    defaultValues: {
      draftLinks: [{ id: crypto.randomUUID(), name: "", url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "draftLinks",
  });

  const watchGAId = watch("GAId");

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await getSupervisor();
      const data = await response.json();
      if (response.ok && data) {
        setSupervisorList(data.data);
      }
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  // Get selected dosen data
  const selectedDosen = useMemo(() => {
    return supervisorList.find((d) => d.id === selectedDosenId);
  }, [selectedDosenId]);

  useEffect(() => {
    if (selectedDosen) {
      setValue("supervisor_type", selectedDosen.supervisor_type);
    }
  }, [selectedDosen]);

  // Get available slots for selected dosen
  const availableSlots = useMemo(() => {
    if (!selectedDosen) return [];
    return selectedDosen.availability;
  }, [selectedDosen]);

  // Get selected slot details
  const selectedSlot = useMemo(() => {
    if (!selectedDosen || !watchGAId) return null;
    return selectedDosen.availability.find(
      (slot) => slot.id === Number(watchGAId)
    );
  }, [selectedDosen, watchGAId]);

  const onSubmit = async (data: PengajuanBimbinganForm) => {
    setIsSubmitting(true);

    try {
      const response = await onCreate(data);
      if (response.ok) {
        setSubmitSuccess(true);

        // Reset form after successful submission
        reset({
          draftLinks: [{ id: crypto.randomUUID(), name: "", url: "" }],
        });
        setSelectedDosenId(null);

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }

      if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.errors.msg) {
          setSubmitError(errorData.errors.msg);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLink = () => {
    append({ id: crypto.randomUUID(), name: "", url: "" });
  };

  const handleRemoveLink = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Pengajuan Bimbingan Tugas Akhir
          </h1>
          <p className="text-gray-600">
            Ajukan jadwal bimbingan dengan dosen pembimbing Anda
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <Card className="border-l-4 border-l-green-500 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">
                    Pengajuan Berhasil!
                  </p>
                  <p className="text-sm text-green-700">
                    Pengajuan bimbingan Anda telah dikirim ke dosen pembimbing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {submitError && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-900">Pengajuan Gagal!</p>
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pilih Dosen */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <User className="w-5 h-5" />
                Pilih Dosen Pembimbing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="lecturerId" className="text-sm font-semibold">
                  Dosen Pembimbing <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedDosenId?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedDosenId(Number(value));
                    setValue("lecturerId", Number(value));
                    setValue("GAId", 0);
                    setValue("fpId", supervisorList[0]?.fpId || 0);
                  }}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Pilih dosen pembimbing..." />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisorList.map((dosen) => (
                      <SelectItem
                        key={dosen.id}
                        value={dosen.id.toString()}
                        data-supervisor-type={dosen.supervisor_type.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{dosen.nama}</p>
                            {dosen.nip && (
                              <p className="text-xs text-gray-500">
                                {dosen.nip} - {dosen.lecturer_code}
                              </p>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.lecturerId && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Pilih dosen pembimbing
                  </p>
                )}
              </div>

              {/* Info Dosen Terpilih */}
              {selectedDosen && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900">
                        {selectedDosen.nama}
                      </p>
                      {selectedDosen.nip && (
                        <p className="text-sm text-blue-700">
                          NIP: {selectedDosen.nip} -{" "}
                          {selectedDosen.lecturer_code}
                        </p>
                      )}
                      <p className="text-sm text-blue-600 mt-2">
                        {availableSlots.length} slot waktu tersedia
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pilih Waktu */}
          {selectedDosen && availableSlots.length > 0 && (
            <Card className="border-t-4 border-t-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Clock className="w-5 h-5" />
                  Pilih Waktu Bimbingan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label
                    htmlFor="slotWaktuId"
                    className="text-sm font-semibold"
                  >
                    Slot Waktu Tersedia <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watchGAId?.toString() || ""}
                    onValueChange={(value) => setValue("GAId", Number(value))}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Pilih waktu yang tersedia..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id.toString()}>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <div>
                              <p className="font-medium">
                                {getDayName(slot.day_of_week)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {slot.start_time} - {slot.end_time}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.GAId && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Pilih waktu bimbingan
                    </p>
                  )}
                </div>

                {/* Selected Slot Info */}
                {selectedSlot && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">
                          {getDayName(selectedSlot.day_of_week)}
                        </p>
                        <p className="text-sm text-purple-700">
                          Pukul {selectedSlot.start_time} -{" "}
                          {selectedSlot.end_time}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Topik & Catatan */}
          {selectedSlot && (
            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <BookOpen className="w-5 h-5" />
                  Detail Bimbingan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Topik */}
                <div>
                  <Label htmlFor="topic" className="text-sm font-semibold">
                    Topik Bimbingan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    {...register("topic", {
                      required: "Topik bimbingan harus diisi",
                    })}
                    placeholder="Contoh: Pembahasan BAB III - Metodologi Penelitian"
                    className="mt-2 h-12"
                  />
                  {errors.topic && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.topic.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Draft Links */}
          {selectedSlot && (
            <Card className="border-t-4 border-t-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <LinkIcon className="w-5 h-5" />
                  Link Draft Tugas Akhir
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Tambahkan link Google Drive untuk draft dokumen yang ingin
                  didiskusikan
                </p>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-orange-900">
                        Draft #{index + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Nama File */}
                    <div>
                      <Label
                        htmlFor={`draftLinks.${index}.name`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Nama File
                      </Label>
                      <Input
                        {...register(`draftLinks.${index}.name`, {
                          required: "Nama file harus diisi",
                        })}
                        placeholder="Contoh: BAB_III_Metodologi.pdf"
                        className="mt-1 h-10"
                      />
                      {errors.draftLinks?.[index]?.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.draftLinks[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    {/* URL */}
                    <div>
                      <Label
                        htmlFor={`draftLinks.${index}.url`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Link Google Drive
                      </Label>
                      <Input
                        {...register(`draftLinks.${index}.url`, {
                          required: "Link harus diisi",
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Format link tidak valid",
                          },
                        })}
                        placeholder="https://drive.google.com/file/d/..."
                        className="mt-1 h-10"
                      />
                      {errors.draftLinks?.[index]?.url && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.draftLinks[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full py-3 border-2 border-dashed border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Link Draft
                </button>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          {selectedSlot && (
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600">
              <CardContent className="p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-gray-50 text-blue-700 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                      Mengirim Pengajuan...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pengajuan Bimbingan
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          )}
        </form>

        {/* Info Box */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">Catatan:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Pastikan Anda memilih waktu yang sesuai dengan jadwal</li>
                  <li>Upload draft dokumen ke Google Drive terlebih dahulu</li>
                  <li>
                    Pastikan link Google Drive dapat diakses oleh dosen
                    pembimbing
                  </li>
                  <li>Pengajuan akan dikonfirmasi oleh dosen pembimbing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PengajuanPage;
