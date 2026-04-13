"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { api } from "@/utils/api";
import {
  AdminProfile,
  AdminProfileFormState,
  AdminProfileFormErrors,
  ExpertiseGroup,
} from "@/types/admin-profile";
import { SignatureInput } from "./SignatureInput";

interface EditProfileFormProps {
  profile: AdminProfile;
  expertiseGroups: ExpertiseGroup[];
  isLoading: boolean;
  onSubmit: (formData: AdminProfileFormState) => Promise<void>;
  onCancel: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  profile,
  expertiseGroups,
  isLoading,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AdminProfileFormState>({
    name: profile.name,
    email: profile.email,
    nip: profile.nip,
    initials: profile.initials,
    whatsapp_number: profile.whatsapp_number || "",
    password: "",
    expertise_group_1: profile.expertise_group_1 || 0,
    expertise_group_2: profile.expertise_group_2 || 0,
    expertise_group_3: profile.expertise_group_3 || 0,
    expertise_group_4: profile.expertise_group_4 || 0,
    signature_data: profile.signature_url || "",
  });

  const [errors, setErrors] = useState<AdminProfileFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: AdminProfileFormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.nip?.trim()) {
      newErrors.nip = "NIP harus diisi";
    }

    if (!formData.initials?.trim()) {
      newErrors.initials = "Inisial harus diisi";
    } else if (formData.initials.length > 5) {
      newErrors.initials = "Inisial maksimal 5 karakter";
    }

    if (
      formData.whatsapp_number?.trim() &&
      !/^\d{10,}$/.test(formData.whatsapp_number.replace(/\D/g, ""))
    ) {
      newErrors.whatsapp_number =
        "Nomor WhatsApp tidak valid (minimal 10 digit)";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Expertise groups validation - all required
    if (!formData.expertise_group_1) {
      newErrors.expertise_group_1 = "Kelompok keahlian 1 harus dipilih";
    }
    if (!formData.expertise_group_2) {
      newErrors.expertise_group_2 = "Kelompok keahlian 2 harus dipilih";
    }
    if (!formData.expertise_group_3) {
      newErrors.expertise_group_3 = "Kelompok keahlian 3 harus dipilih";
    }
    if (!formData.expertise_group_4) {
      newErrors.expertise_group_4 = "Kelompok keahlian 4 harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof AdminProfileFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setSubmitError(error.message || "Gagal menyimpan profil");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Gagal Menyimpan</p>
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Nama */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Masukkan nama lengkap"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>
        )}
      </div>

      {/* NIP */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NIP *
        </label>
        <input
          type="text"
          value={formData.nip}
          onChange={(e) => handleInputChange("nip", e.target.value)}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors ${
            errors.nip ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nomor Induk Pegawai"
        />
        {errors.nip && (
          <p className="text-red-500 text-sm mt-1.5">{errors.nip}</p>
        )}
      </div>

      {/* Inisial */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Inisial *
        </label>
        <input
          type="text"
          value={formData.initials}
          onChange={(e) =>
            handleInputChange(
              "initials",
              e.target.value.toUpperCase().slice(0, 5)
            )
          }
          disabled={isLoading}
          maxLength={5}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors ${
            errors.initials ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Maksimal 5 karakter (cth: DR, PROF)"
        />
        {errors.initials && (
          <p className="text-red-500 text-sm mt-1.5">{errors.initials}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
        )}
      </div>

      {/* Nomor WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nomor WhatsApp
        </label>
        <input
          type="text"
          value={formData.whatsapp_number || ""}
          onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors ${
            errors.whatsapp_number ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="62812345678"
        />
        <p className="text-gray-500 text-xs mt-1">Opsional</p>
        {errors.whatsapp_number && (
          <p className="text-red-500 text-sm mt-1.5">
            {errors.whatsapp_number}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Baru
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Kosongkan jika tidak ingin mengubah password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Minimal 6 karakter. Kosongkan jika tidak ingin mengubah
        </p>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>
        )}
      </div>

      {/* Expertise Groups Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kelompok Keahlian *
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelompok Keahlian {index} *
              </label>
              <select
                value={
                  formData[
                    `expertise_group_${index}` as keyof AdminProfileFormState
                  ] || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    `expertise_group_${index}`,
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                disabled={isLoading}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 transition-colors bg-white cursor-pointer ${
                  errors[
                    `expertise_group_${index}` as keyof AdminProfileFormErrors
                  ]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Pilih Kelompok Keahlian</option>
                {expertiseGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors[
                `expertise_group_${index}` as keyof AdminProfileFormErrors
              ] && (
                <p className="text-red-500 text-sm mt-1.5">
                  {
                    errors[
                      `expertise_group_${index}` as keyof AdminProfileFormErrors
                    ]
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Signature Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tanda Tangan
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Tambahkan atau perbarui tanda tangan Anda untuk dokumen resmi
        </p>
        <SignatureInput
          value={formData.signature_data || ""}
          onChange={(signatureData) =>
            handleInputChange("signature_data", signatureData)
          }
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-white bg-primary hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </button>
      </div>
    </form>
  );
};
