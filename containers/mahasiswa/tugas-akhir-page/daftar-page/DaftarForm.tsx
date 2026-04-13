"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import ErrorValidation from "@/components/forms/errorMessage";
import { FormData } from "./index";
import SearchableStudentSelect from "./searchableStudentInput";
import { Student } from "@/containers/mahasiswa/tugas-akhir-page/daftar-page/searchableStudentInput";
import { Message } from "@/types/forms";
import { error } from "console";

interface Props {
  formData: any;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | Student
      | null
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleNext: () => void;
  currentMemberIndex: number;
  totalMembers: number;
  isLastMember: boolean;
  isFirstMember: boolean;
  onPreviousMember: () => void;
  isSuratDispensasiEnabled: boolean;
  formDataErrors: Partial<FormData>;
  setFormDataErrors: React.Dispatch<React.SetStateAction<Partial<FormData>>>;
  errorsFromApi?: any;
  messageFromApi?: any;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function DaftarForm({
  formData,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  handleNext,
  currentMemberIndex,
  totalMembers,
  isLastMember,
  isFirstMember,
  onPreviousMember,
  isSuratDispensasiEnabled,
  formDataErrors,
  setFormDataErrors,
  errorsFromApi,
  messageFromApi,
}: Props) {
  const draftFileInputRef = useRef<HTMLInputElement>(null);
  const suratFileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // init errors and message
  useEffect(() => {
    setMessage(messageFromApi);
  }, [messageFromApi]);

  // Reset file inputs display when member changes
  // The actual file data is preserved in formData state
  useEffect(() => {
    // Reset file inputs to clear the displayed filename
    if (draftFileInputRef.current) {
      draftFileInputRef.current.value = "";
    }
    if (suratFileInputRef.current) {
      suratFileInputRef.current.value = "";
    }
    // Clear errors when switching members
    setErrors({});
    setFormDataErrors({});
  }, [currentMemberIndex, setFormDataErrors]);

  // Validation functions
  const validateField = (
    name: keyof FormData,
    value: any
  ): string | undefined => {
    switch (name) {
      case "email":
        if (!value) return "Email wajib diisi";
        break;
      case "title":
        if (!value) return "Judul wajib diisi";
        break;
      case "resume":
        if (!value) return "Resume wajib diisi";
        break;
      case "draft_path":
        if (!value || !(value instanceof File)) {
          return "Draft Tugas Akhir wajib diisi";
        }
        break;
      case "dispen_path":
        if (isSuratDispensasiEnabled) {
          if (!value || !(value instanceof File)) {
            return "Surat Dispensasi wajib diisi";
          }
        }
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  // validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<any> | Student | null,
    name: keyof FormData,
    value: any
  ) => {
    if (!e) return;

    if ("id" in e) {
      handleInputChange(e as Student);
    } else {
      handleInputChange(e);

      // Real-time validation for touched fields
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }
  };

  const handleChangeFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof FormData,
    value: any
  ) => {
    handleFileChange(e);
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handlePrevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setErrors({});
    onPreviousMember();
  };

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    handleNext();
    setErrors({});
  };

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      console.log(errors);
      return;
    }

    handleSubmit(e as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ErrorsFromApi print */}
      {errorsFromApi && (
        <div>
          {Object.entries(errorsFromApi).map(([field, message]) => (
            <div key={field} className="text-red-500">
              {message as React.ReactNode}
            </div>
          ))}
        </div>
      )}

      {/* Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-center transition-all duration-300 ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}
      {/* Member Header */}
      {totalMembers > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold">
            Data Anggota {currentMemberIndex + 1}
          </h3>
          <p className="text-sm">
            Silakan isi data untuk anggota {currentMemberIndex + 1} dari{" "}
            {totalMembers} anggota
          </p>
        </div>
      )}
      {/* email mahasiswa */}
      <div>
        <label className="form-label-input">Email</label>
        <SearchableStudentSelect
          value={formData.email}
          name="email"
          placeholder="Ketik email mahasiswa..."
          handleInputChange={(student) => {
            if (student) {
              handleChange(student, "email", student.email);
            } else {
              // Handle clearing the selection
              handleInputChange({
                target: { name: "email", value: "" },
              } as React.ChangeEvent<HTMLInputElement>);
              handleInputChange({
                target: { name: "studentId", value: "" },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          handleInputBlur={handleBlur}
        />
        {formDataErrors.email && (
          <ErrorValidation error={formDataErrors.email} />
        )}
        {errors.email && !formDataErrors.email && (
          <ErrorValidation error={errors.email} />
        )}
      </div>

      {/* Judul Tugas Akhir */}
      <div>
        <label className="form-label-input">Judul Tugas Akhir</label>
        <textarea
          name="title"
          value={formData.title}
          onChange={(e) => handleChange(e, "title", e.target.value)}
          onBlur={() => handleBlur("title")}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border ${
            touched.title && errors.title
              ? "border-red-500"
              : "bg-secondary border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Masukkan judul tugas akhir"
        />
        {touched.title && errors.title && (
          <ErrorValidation error={errors.title} />
        )}
      </div>

      {/* Resume Kebaharuan */}
      <div>
        <label className="form-label-input">
          Resume Kebaharuan Dari Penelitian Pembanding
        </label>
        <p className="text-gray-600 text-sm mb-2">
          Minimal resume dari 5 jurnal pembanding
        </p>
        <textarea
          name="resume"
          value={formData.resume}
          onChange={(e) => handleChange(e, "resume", e.target.value)}
          onBlur={() => handleBlur("resume")}
          rows={6}
          className={`w-full px-4 py-3 rounded-lg border ${
            touched.resume && errors.resume
              ? "border-red-500"
              : "bg-secondary border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Masukkan resume kebaharuan dari penelitian pembanding"
        />
        {touched.resume && errors.resume && (
          <ErrorValidation error={errors.resume} />
        )}
      </div>

      {/* Draft Tugas Akhir */}
      <div>
        <label className="form-label-input">Draft Tugas Akhir</label>
        <p className="text-gray-600 text-sm mb-2">
          Bab 1,2,3 dengan format penamaan (NIM_NAMA LENGKAP)
        </p>
        <p className="text-gray-600 text-sm mb-2">
          Maksimal ukuran file: <strong>10 MB</strong>
        </p>
        <div className="relative">
          <input
            ref={draftFileInputRef}
            type="file"
            name="draft_path"
            onChange={(e) =>
              handleChangeFile(e, "draft_path", e.target.files?.[0] || null)
            }
            onBlur={() => handleBlur("draft_path")}
            accept=".pdf"
            className={`w-full px-4 py-3 rounded-lg border ${
              (touched.draft_path && errors.draft_path) ||
              formDataErrors.draft_path
                ? "border-red-500"
                : "border-gray-300"
            } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
          />
          <Upload
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        {formData.draft_path && (
          <p className="text-sm text-green-600 mt-1">
            File terpilih: {formData.draft_path.name}
          </p>
        )}
        {formDataErrors.draft_path && (
          <ErrorValidation error={formDataErrors.draft_path} />
        )}
        {touched.draft_path && errors.draft_path && (
          <ErrorValidation error={errors.draft_path} />
        )}
      </div>

      {/* Surat Dispensasi */}
      {isSuratDispensasiEnabled && (
        <div>
          <label className="form-label-input">Surat Dispensasi</label>
          <p className="text-gray-600 text-sm mb-2">
            Format penamaan (NIM_NAMA LENGKAP)
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Maksimal ukuran file: <strong>10 MB</strong>
          </p>
          <div className="relative">
            <input
              ref={suratFileInputRef}
              type="file"
              name="dispen_path"
              onChange={(e) =>
                handleChangeFile(e, "dispen_path", e.target.files?.[0] || null)
              }
              onBlur={() => handleBlur("dispen_path")}
              accept=".pdf"
              className={`w-full px-4 py-3 rounded-lg border ${
                (touched.dispen_path && errors.dispen_path) ||
                formDataErrors.dispen_path
                  ? "border-red-500"
                  : "border-gray-300"
              } bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            />
            <Upload
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          {formData.dispen_path && (
            <p className="text-sm text-green-600 mt-1">
              File terpilih: {formData.dispen_path.name}
            </p>
          )}
          {formDataErrors.dispen_path && (
            <ErrorValidation error={formDataErrors.dispen_path} />
          )}
          {touched.dispen_path && errors.dispen_path && (
            <ErrorValidation error={errors.dispen_path} />
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-6">
        {!isFirstMember && (
          <button
            className="form-submit-button"
            type="button"
            onClick={handlePrevClick}
          >
            Sebelumnya
          </button>
        )}

        {!isLastMember ? (
          <button
            className="form-submit-button"
            type="button"
            onClick={handleNextClick}
          >
            Selanjutnya
          </button>
        ) : (
          <button
            className="form-submit-button"
            type="submit"
            onClick={handleSubmitClick}
          >
            Daftar
          </button>
        )}
      </div>
    </form>
  );
}
