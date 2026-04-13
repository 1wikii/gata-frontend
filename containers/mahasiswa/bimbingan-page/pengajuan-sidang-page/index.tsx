"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray, set } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dosen,
  PengajuanSidangForm,
  TipeSidang,
  Links,
} from "@/types/pengajuan-sidang-mahasiswa";
import {
  User,
  GraduationCap,
  Send,
  CheckCircle,
  AlertCircle,
  ClipboardCheck,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";

interface Props {
  getSupervisor: () => Promise<any>;
  getExpertisesGroup: () => Promise<any>;
  getFinalProjectMembers: () => Promise<any>;
  onSave: (data: PengajuanSidangForm) => Promise<any>;
}

const PengajuanSidangPage: React.FC<Props> = ({
  getSupervisor,
  getExpertisesGroup,
  getFinalProjectMembers,
  onSave,
}) => {
  const [supervisorList, setSupervisorList] = useState<Dosen[]>([]);
  const [expertisesGroup, setExpertisesGroup] = useState<any[]>([]);
  const [fpMembers, setFpMembers] = useState<any[]>([]);
  const [selectedPembimbingId, setSelectedPembimbingId] = useState<
    number | null
  >(null);
  const [selectedExpertiseGroupId, setSelectedExpertiseGroupId] = useState<
    number | null
  >(null);
  const [selectedExpertiseGroupId2, setSelectedExpertiseGroupId2] = useState<
    number | null
  >(null);

  const [selectedTipeSidang, setSelectedTipeSidang] =
    useState<TipeSidang | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<PengajuanSidangForm>({
    defaultValues: {
      finalDraftLinks: [
        {
          id: crypto.randomUUID(),
          name: "",
          url: "",
          type: "draft",
          email: "",
        },
      ],
      pptLinks: [
        { id: crypto.randomUUID(), name: "", url: "", type: "ppt", email: "" },
      ],
    },
  });

  // Watch finalDraftLinks and pptLinks untuk real-time updates
  const watchedFinalLinks = watch("finalDraftLinks");
  const watchedPptLinks = watch("pptLinks");

  const {
    fields: finalFields,
    append: appendFinal,
    remove: removeFinal,
  } = useFieldArray({
    control,
    name: "finalDraftLinks",
  });

  const {
    fields: pptFields,
    append: appendPpt,
    remove: removePpt,
  } = useFieldArray({
    control,
    name: "pptLinks",
  });

  useEffect(() => {
    fetchSupervisorList();
    fetchExpertisesGroup();
    fetchFinalProjectMembers();
  }, []);

  const fetchSupervisorList = async () => {
    try {
      const response = await getSupervisor();
      if (response.ok) {
        const data = await response.json();
        setSupervisorList(data.data);
      }
    } catch (error) {
      console.error("Error fetching supervisor list:", error);
    }
  };

  const fetchExpertisesGroup = async () => {
    try {
      const response = await getExpertisesGroup();
      if (response.ok) {
        const data = await response.json();
        setExpertisesGroup(data.data);
      }
    } catch (error) {
      console.error("Error fetching expertises group:", error);
    }
  };

  const fetchFinalProjectMembers = async () => {
    try {
      const response = await getFinalProjectMembers();
      if (response.ok) {
        const data = await response.json();
        setFpMembers(data.data);
      }
    } catch (error) {
      console.error("Error fetching final project members:", error);
    }
  };

  const handleAddFinalLink = () => {
    appendFinal({
      id: crypto.randomUUID(),
      name: "",
      url: "",
      type: "draft",
      email: "",
    });
  };

  const handleRemoveFinalLink = (index: number) => {
    if (finalFields.length > 1) {
      removeFinal(index);
    }
  };

  const handleAddPptLink = () => {
    appendPpt({
      id: crypto.randomUUID(),
      name: "",
      url: "",
      type: "ppt",
      email: "",
    });
  };

  const handleRemovePptLink = (index: number) => {
    if (pptFields.length > 1) {
      removePpt(index);
    }
  };

  const onSubmit = async (data: PengajuanSidangForm) => {
    setIsSubmitting(true);

    try {
      const response = await onSave(data);
      const resData = await response.json();

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setSelectedPembimbingId(null);
          setSelectedTipeSidang(null);
          setSelectedExpertiseGroupId(null);
          setSelectedExpertiseGroupId2(null);
          setSubmitSuccess(false);
        }, 2000);
      }

      if (response.status === 400 && resData.errors) {
        setIsSubmitting(false);
        setSubmitError(resData.errors.msg);

        // Reset form after error
        setTimeout(() => {
          setSelectedPembimbingId(null);
          setSelectedTipeSidang(null);
          setSelectedExpertiseGroupId(null);
          setSelectedExpertiseGroupId2(null);
        }, 2000);

        setTimeout(() => {
          setSubmitError(null);
        }, 8000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pengajuan Sidang Tugas Akhir
              </h1>
              <p className="text-gray-600">
                Ajukan jadwal sidang proposal atau hasil tugas akhir Anda
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <Card className="border-l-4 border-l-green-500 bg-green-50 shadow-lg">
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
                    Pengajuan sidang Anda telah dikirim dan menunggu persetujuan
                    dosen
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* error message */}
        {submitError && (
          <Card className="border-l-4 border-l-red-500 bg-red-50 shadow-lg">
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
          {/* Tipe Sidang */}
          <Card className="border-t-4 border-t-indigo-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50">
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <ClipboardCheck className="w-5 h-5" />
                Tipe Sidang
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="tipeSidang" className="text-sm font-semibold">
                  Pilih Tipe Sidang <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedTipeSidang || ""}
                  onValueChange={(value: TipeSidang) => {
                    setSelectedTipeSidang(value);
                    setValue("tipeSidang", value);
                  }}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Pilih tipe sidang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposal">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Sidang Proposal</p>
                          <p className="text-xs text-gray-500">
                            Presentasi proposal penelitian
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="hasil">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Sidang Hasil</p>
                          <p className="text-xs text-gray-500">
                            Presentasi hasil penelitian final
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipeSidang && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Pilih tipe sidang
                  </p>
                )}
              </div>

              {/* Selected Type Info */}
              {selectedTipeSidang && (
                <div
                  className={`p-4 rounded-lg border ${
                    selectedTipeSidang === "proposal"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedTipeSidang === "proposal"
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                    >
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          selectedTipeSidang === "proposal"
                            ? "text-blue-900"
                            : "text-green-900"
                        }`}
                      >
                        {selectedTipeSidang === "proposal"
                          ? "Sidang Proposal"
                          : "Sidang Hasil"}
                      </p>
                      <p
                        className={`text-sm ${
                          selectedTipeSidang === "proposal"
                            ? "text-blue-700"
                            : "text-green-700"
                        }`}
                      >
                        {selectedTipeSidang === "proposal"
                          ? "Pastikan proposal Anda sudah lengkap dan siap dipresentasikan"
                          : "Pastikan hasil penelitian Anda sudah final dan siap diuji"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pilih Dosen Pembimbing */}
          {selectedTipeSidang && (
            <Card className="border-t-4 border-t-blue-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <User className="w-5 h-5" />
                  Dosen Pembimbing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Dosen Pembimbing 1 */}
                <div>
                  <Label
                    htmlFor="dosenPembimbingId"
                    className="text-sm font-semibold"
                  >
                    Pilih Dosen Pembimbing 1{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedPembimbingId?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedPembimbingId(Number(value));
                      setValue("lecturerId", Number(value));
                      setValue(
                        "fpId",
                        supervisorList.find(
                          (dosen) => dosen.id === Number(value)
                        )?.fpId || 0
                      ); // Set fpId berdasarkan dosen terpilih
                    }}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Pilih dosen pembimbing 1..." />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisorList.map((dosen) => (
                        <SelectItem key={dosen.id} value={dosen.id.toString()}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="font-medium">{dosen.nama}</p>
                              <p className="text-xs text-gray-500">
                                {dosen.nip} - {dosen.lecturer_code}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lecturerId && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Pilih dosen pembimbing 1
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kelompok Keahlian */}
          {selectedPembimbingId && (
            <Card className="border-t-4 border-t-purple-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <ClipboardCheck className="w-5 h-5" />
                  Kelompok Keahlian
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Kelompok Keahlian 1 */}
                <div>
                  <Label
                    htmlFor="expertiseGroup1"
                    className="text-sm font-semibold"
                  >
                    Pilih Kelompok Keahlian 1{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedExpertiseGroupId?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedExpertiseGroupId(Number(value));
                      setValue("expertiseGroup1Id", Number(value));
                    }}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Pilih kelompok keahlian 1..." />
                    </SelectTrigger>
                    <SelectContent>
                      {expertisesGroup.map((expertise) => (
                        <SelectItem
                          key={expertise.id}
                          value={expertise.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <p>
                              <span className="font-bold">
                                {expertise.name}
                              </span>{" "}
                              - {expertise.description}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expertiseGroup1Id && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Pilih kelompok keahlian 1
                    </p>
                  )}
                </div>

                {/* Kelompok Keahlian 2 */}
                <div>
                  <Label
                    htmlFor="expertiseGroup2"
                    className="text-sm font-semibold"
                  >
                    Pilih Kelompok Keahlian 2{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedExpertiseGroupId2?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedExpertiseGroupId2(Number(value));
                      setValue("expertiseGroup2Id", Number(value));
                    }}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Pilih kelompok keahlian 2..." />
                    </SelectTrigger>
                    <SelectContent>
                      {expertisesGroup.map((expertise) => (
                        <SelectItem
                          key={expertise.id}
                          value={expertise.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <p>
                              <span className="font-bold">
                                {expertise.name}
                              </span>{" "}
                              - {expertise.description}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expertiseGroup2Id && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Pilih kelompok keahlian 2
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final Draft Links */}
          {selectedExpertiseGroupId && (
            <Card className="border-t-4 border-t-rose-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-rose-100/50">
                <CardTitle className="flex items-center gap-2 text-rose-900">
                  <FileText className="w-5 h-5" />
                  Link Draft Final Tugas Akhir
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Tambahkan link Google Drive untuk draft final dokumen Anda
                </p>

                {finalFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-rose-50 p-4 rounded-lg border border-rose-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-rose-900">
                        Draft Final #{index + 1}
                      </span>
                      {finalFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFinalLink(index)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Email - Milik Mahasiswa Siapa */}
                    <div>
                      <Label
                        htmlFor={`finalDraftLinks.${index}.email`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Milik Mahasiswa <span className="text-red-500">*</span>
                      </Label>
                      <input
                        {...register(`finalDraftLinks.${index}.email`, {
                          required: "Pilih mahasiswa",
                        })}
                        type="hidden"
                      />
                      <Select
                        value={watchedFinalLinks[index]?.email || ""}
                        onValueChange={(value) => {
                          setValue(`finalDraftLinks.${index}.email`, value);
                        }}
                      >
                        <SelectTrigger className="mt-1 h-10 w-full">
                          {watchedFinalLinks[index]?.email ? (
                            <span className="text-gray-900 truncate">
                              {fpMembers.find(
                                (m) =>
                                  m.email === watchedFinalLinks[index]?.email
                              )?.name || "Pilih mahasiswa..."}
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Pilih mahasiswa...
                            </span>
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {fpMembers.length > 0 ? (
                            fpMembers.map((member) => (
                              <SelectItem
                                key={member.email}
                                value={member.email}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                  <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500">
                              Tidak ada data mahasiswa
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.finalDraftLinks?.[index]?.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.finalDraftLinks[index]?.email?.message}
                        </p>
                      )}
                    </div>

                    {/* Nama File */}
                    <div>
                      <Label
                        htmlFor={`finalDraftLinks.${index}.name`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Nama File
                      </Label>
                      <Input
                        {...register(`finalDraftLinks.${index}.name`, {
                          required: "Nama file harus diisi",
                        })}
                        placeholder="Contoh: Laporan_Final.pdf"
                        className="mt-1 h-10"
                      />
                      {errors.finalDraftLinks?.[index]?.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.finalDraftLinks[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    {/* URL */}
                    <div>
                      <Label
                        htmlFor={`finalDraftLinks.${index}.url`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Link Google Drive
                      </Label>
                      <Input
                        {...register(`finalDraftLinks.${index}.url`, {
                          required: "Link harus diisi",
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Format link tidak valid",
                          },
                        })}
                        placeholder="https://drive.google.com/file/d/..."
                        className="mt-1 h-10"
                      />
                      {errors.finalDraftLinks?.[index]?.url && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.finalDraftLinks[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  type="button"
                  onClick={handleAddFinalLink}
                  className="w-full py-3 border-2 border-dashed border-rose-300 rounded-lg text-rose-700 hover:bg-rose-50 hover:border-rose-400 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Link Draft Final
                </button>
              </CardContent>
            </Card>
          )}

          {/* PPT Links */}
          {selectedExpertiseGroupId && (
            <Card className="border-t-4 border-t-amber-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50">
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <FileText className="w-5 h-5" />
                  Link Slide PPT
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Tambahkan link Google Drive untuk slide presentasi PPT Anda
                </p>

                {pptFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-900">
                        Slide PPT #{index + 1}
                      </span>
                      {pptFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePptLink(index)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Email - Milik Mahasiswa Siapa */}
                    <div>
                      <Label
                        htmlFor={`pptLinks.${index}.email`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Milik Mahasiswa <span className="text-red-500">*</span>
                      </Label>
                      <input
                        {...register(`pptLinks.${index}.email`, {
                          required: "Pilih mahasiswa",
                        })}
                        type="hidden"
                      />
                      <Select
                        value={watchedPptLinks[index]?.email || ""}
                        onValueChange={(value) => {
                          setValue(`pptLinks.${index}.email`, value);
                        }}
                      >
                        <SelectTrigger className="mt-1 h-10 w-full">
                          {watchedPptLinks[index]?.email ? (
                            <span className="text-gray-900 truncate">
                              {fpMembers.find(
                                (m) => m.email === watchedPptLinks[index]?.email
                              )?.name || "Pilih mahasiswa..."}
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Pilih mahasiswa...
                            </span>
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {fpMembers.length > 0 ? (
                            fpMembers.map((member) => (
                              <SelectItem
                                key={member.email}
                                value={member.email}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                  <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500">
                              Tidak ada data mahasiswa
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.pptLinks?.[index]?.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.pptLinks[index]?.email?.message}
                        </p>
                      )}
                    </div>

                    {/* Nama File */}
                    <div>
                      <Label
                        htmlFor={`pptLinks.${index}.name`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Nama File
                      </Label>
                      <Input
                        {...register(`pptLinks.${index}.name`, {
                          required: "Nama file harus diisi",
                        })}
                        placeholder="Contoh: Presentasi_Final.pptx"
                        className="mt-1 h-10"
                      />
                      {errors.pptLinks?.[index]?.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.pptLinks[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    {/* URL */}
                    <div>
                      <Label
                        htmlFor={`pptLinks.${index}.url`}
                        className="text-xs font-medium text-gray-700"
                      >
                        Link Google Drive
                      </Label>
                      <Input
                        {...register(`pptLinks.${index}.url`, {
                          required: "Link harus diisi",
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Format link tidak valid",
                          },
                        })}
                        placeholder="https://drive.google.com/file/d/..."
                        className="mt-1 h-10"
                      />
                      {errors.pptLinks?.[index]?.url && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.pptLinks[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  type="button"
                  onClick={handleAddPptLink}
                  className="w-full py-3 border-2 border-dashed border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Link Slide PPT
                </button>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          {selectedPembimbingId && (
            <Card className="bg-gradient-to-r from-indigo-600 to-pink-600 shadow-xl">
              <CardContent className="p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-gray-50 text-indigo-700 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                      Mengirim Pengajuan...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pengajuan Sidang
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          )}
        </form>

        {/* Info Box */}
        <Card className="border-l-4 border-l-indigo-500 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">
                  Persyaratan Pengajuan Sidang:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Pastikan semua dokumen sudah lengkap dan sesuai format
                  </li>
                  <li>
                    Link Google Drive harus dapat diakses oleh dosen pembimbing
                    dan penguji
                  </li>
                  <li>
                    Untuk sidang proposal, pastikan proposal sudah disetujui
                    pembimbing
                  </li>
                  <li>
                    Untuk sidang hasil, pastikan bimbingan minimal sudah
                    terpenuhi
                  </li>
                  <li>
                    Pengajuan akan diproses maksimal 3 hari kerja setelah
                    disubmit
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PengajuanSidangPage;
