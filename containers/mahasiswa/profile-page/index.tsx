"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  Save,
  X,
  AlertCircle,
  Mail,
  MessageCircle,
  Hash,
  User,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import {
  MahasiswaProfile,
  MahasiswaProfileFormState,
  MahasiswaProfileFormErrors,
} from "@/types/mahasiswa-profile";
import { fetchMahasiswaProfile, updateMahasiswaProfile } from "./profileApi";

export default function StudentProfile() {
  const [profile, setProfile] = useState<MahasiswaProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<MahasiswaProfileFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<MahasiswaProfileFormState>({
    name: "",
    nim: "",
    email: "",
    whatsapp_number: "",
    password: "",
  });

  // Load profile data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profileData = await fetchMahasiswaProfile();
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        nim: profileData.nim,
        email: profileData.email,
        whatsapp_number: profileData.whatsapp_number || "",
        password: "",
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data profil");
      console.error("Error loading profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: MahasiswaProfileFormErrors = {};

    // Nama validation
    if (!formData.name?.trim()) {
      errors.name = "Nama harus diisi";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Nama harus minimal 3 karakter";
    }

    // NIM validation
    if (!formData.nim?.trim()) {
      errors.nim = "NIM harus diisi";
    } else if (formData.nim?.trim().length < 8) {
      errors.nim = "NIM harus minimal 8 karakter";
    }

    // Email validation
    if (!formData.email?.trim()) {
      errors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    // WhatsApp validation (optional but if provided, min 10 digits)
    if (formData.whatsapp_number?.trim()) {
      const digitsOnly = formData.whatsapp_number.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        errors.whatsapp_number = "Nomor WhatsApp minimal 10 digit";
      }
    }

    // Password validation (optional but if provided, min 6 chars)
    if (formData.password?.trim()) {
      if (formData.password.trim().length < 6) {
        errors.password = "Password minimal 6 karakter";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof MahasiswaProfileFormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateMahasiswaProfile(formData);
      setProfile(updatedProfile);
      setFormData({
        name: updatedProfile.name,
        nim: updatedProfile.nim,
        email: updatedProfile.email,
        whatsapp_number: updatedProfile.whatsapp_number || "",
        password: "",
      });
      setIsEditing(false);
      setSuccessMessage("Profil berhasil diperbarui");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil");
      console.error("Error saving profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile
    if (profile) {
      setFormData({
        name: profile.name,
        nim: profile.nim,
        email: profile.email,
        whatsapp_number: profile.whatsapp_number || "",
        password: "",
      });
    }
    setIsEditing(false);
    setFormErrors({});
    setError(null);
    setShowPassword(false);
  };

  // Loading state
  if (isLoading && !profile) {
    return <Loading />;
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="content-section w-full">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Gagal Memuat Profil</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="content-section w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Mahasiswa</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi profil akademik Anda
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {!isEditing ? (
          // Display Mode
          <div className="space-y-6">
            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Nama
                    </p>
                    <p className="text-gray-900">{profile.name}</p>
                  </div>
                </div>
              </div>

              {/* NIM */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      NIM
                    </p>
                    <p className="text-gray-900">{profile.nim}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Email
                    </p>
                    <p className="text-gray-900 break-words">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      WhatsApp
                    </p>
                    <p className="text-gray-900">
                      {profile.whatsapp_number || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Read-only Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Akademik
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pembimbing 1 */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Pembimbing 1
                      </p>
                      <p className="text-gray-900">
                        {profile.pembimbing_1 || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pembimbing 2 */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Pembimbing 2
                      </p>
                      <p className="text-gray-900">
                        {profile.pembimbing_2 || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Judul Tugas Akhir */}
              <div className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Judul Tugas Akhir
                      </p>
                      <p className="text-gray-900 break-words">
                        {profile.judul_tugas_akhir || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="pt-6 border-t">
              <Button
                type="button"
                onClick={handleEdit}
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                <Edit2 size={16} />
                Edit Profil
              </Button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nama *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formErrors.name
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-300 bg-white focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
                placeholder="Masukkan nama lengkap"
              />
              {formErrors.name && (
                <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* NIM */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                NIM *
              </label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formErrors.nim
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-300 bg-white focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
                placeholder="Masukkan NIM"
              />
              {formErrors.nim && (
                <p className="text-red-600 text-sm mt-1">{formErrors.nim}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formErrors.email
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-300 bg-white focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
                placeholder="Masukkan email"
              />
              {formErrors.email && (
                <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formErrors.whatsapp_number
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-300 bg-white focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
                placeholder="Masukkan nomor WhatsApp (opsional)"
              />
              {formErrors.whatsapp_number && (
                <p className="text-red-600 text-sm mt-1">
                  {formErrors.whatsapp_number}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.password
                      ? "border-red-300 bg-red-50 focus:ring-red-500"
                      : "border-gray-300 bg-white focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 pr-10`}
                  placeholder="Masukkan password baru (opsional, min 6 karakter)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan jika tidak ingin mengubah password
              </p>
            </div>
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="flex-1"
              >
                <Save size={16} />
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                <X size={16} />
                Batal
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
