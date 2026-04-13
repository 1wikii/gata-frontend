"use client";
import React, { useState } from "react";
import ErrorValidation from "@/components/forms/errorMessage";
import { Message } from "@/types/forms";
import { PeriodData } from "@/types/admin";

interface PeriodeProps {
  onSubmit: (data: PeriodData) => Promise<any>;
}

interface FormErrors {
  start_date?: string;
  end_date?: string;
  description?: string;
}

const Periode = ({ onSubmit }: PeriodeProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PeriodData>({
    start_date: "",
    end_date: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  // Validation functions
  const validateField = (
    name: keyof PeriodData,
    value: any
  ): string | undefined => {
    switch (name) {
      case "start_date":
        if (!value) return "Tanggal mulai wajib diisi";
        if (formData.end_date && value > formData.end_date)
          return "Tanggal mulai harus sebelum tanggal selesai";
        break;
      case "end_date":
        if (!value) return "Tanggal selesai wajib diisi";
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof PeriodData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (name: keyof PeriodData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle input blur
  const handleInputBlur = (name: keyof PeriodData) => {
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

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await onSubmit(formData);

      if (result.errors) {
        const newErrors = Array.isArray(result.errors)
          ? Object.fromEntries(result.errors.map((e: any) => [e.path, e.msg]))
          : { [result.errors.path]: result.errors.msg };

        setErrors((prev: any) => ({
          ...prev,
          ...newErrors,
        }));

        return;
      } else {
        setMessage({
          type: "success",
          text: result.message || "Periode berhasil dipublish",
        });

        setTimeout(() => {
          setMessage({ type: "", text: "" });
          window.location.reload();
        }, 2000);

        setErrors({});
        setTouched({});

        // clear form
        setFormData({
          start_date: "",
          end_date: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form className="main-container w-4xl mx-auto">
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

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Date Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="form-label-input">Tanggal Buka</label>
            <div className="relative">
              <input
                type="date"
                name="start_date"
                className="form-input"
                value={formData.start_date}
                onChange={(e) =>
                  handleInputChange("start_date", e.target.value)
                }
                onBlur={() => handleInputBlur("start_date")}
              />
            </div>

            {touched.start_date && errors.start_date && (
              <ErrorValidation error={errors.start_date} />
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="form-label-input">Tanggal Tutup</label>
            <div className="relative">
              <input
                type="date"
                name="end_date"
                className="form-input"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                onBlur={() => handleInputBlur("end_date")}
              />
            </div>

            {touched.end_date && errors.end_date && (
              <ErrorValidation error={errors.end_date} />
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="form-label-input">Deskripsi</label>
          <textarea
            typeof="text"
            name="description"
            rows={6}
            className="form-input"
            value={formData.description}
            placeholder="Masukkan deskripsi pendaftaran tugas akhir..."
            onChange={(e) => handleInputChange("description", e.target.value)}
            onBlur={() => handleInputBlur("description")}
          />
        </div>
        {touched.description && errors.description && (
          <ErrorValidation error={errors.description} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          className="form-submit-button"
        >
          {isSubmitting ? "Loading..." : "Publish"}
        </button>
      </div>

      {/* Information Panel */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-blue-800 font-semibold mb-2">Informasi Penting:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li className="font-bold text-red-600">
            • Sistem otomatis +7 hari dari tanggal tutup untuk masa validasi
          </li>
          <li>
            • Pastikan tanggal buka dan tutup sesuai dengan jadwal akademik
          </li>
          <li>
            • Setelah dipublish, pengaturan ini akan aktif untuk semua mahasiswa
          </li>
        </ul>
      </div>
    </form>
  );
};

export default Periode;
