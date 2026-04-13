import React, { useState, useEffect } from "react";
import { X, Save, AlertTriangle } from "lucide-react";
import { User, UserFormState, UserFormErrors, UserRole } from "@/types/users";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormState) => Promise<void>;
  editingUser?: User | null;
  onConfirmDelete?: () => Promise<void>;
}

const defaultFormState: UserFormState = {
  role: "",
  email: "",
  name: "",
  nip: "",
  nim: "",
  initials: "",
  whatsapp_number: "",
  password: "",
};

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  onConfirmDelete,
}) => {
  const [formData, setFormData] = useState<UserFormState>(defaultFormState);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Initialize form data when modal opens or editing user changes
  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        // Edit mode
        setFormData({
          role: editingUser.role,
          email: editingUser.email,
          name: editingUser.name,
          nip: editingUser.nip || "",
          nim: editingUser.nim || "",
          initials: editingUser.initials || "",
          whatsapp_number: editingUser.whatsapp_number || "",
          password: "",
        });
        setIsActive(editingUser.is_active || true);
      } else {
        // Create mode
        setFormData(defaultFormState);
        setIsActive(true);
      }
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [isOpen, editingUser]);

  const validateForm = (): boolean => {
    const newErrors: UserFormErrors = {};

    if (!formData.role) {
      newErrors.role = "Role harus dipilih";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.name?.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    // NIP/NIM validation based on role
    if (formData.role !== "student") {
      if (!formData.nip?.trim()) {
        newErrors.nip = "NIP harus diisi untuk Admin";
      }

      if (!formData.nip?.trim()) {
        newErrors.nip = "NIP harus diisi untuk Dosen";
      }
      if (!formData.initials?.trim()) {
        newErrors.initials = "Inisial harus diisi untuk Dosen";
      }
    } else if (formData.role === "student") {
      if (!formData.nim?.trim()) {
        newErrors.nim = "NIM harus diisi untuk Mahasiswa";
      }
    }

    if (!editingUser) {
      // Password hanya wajib untuk create
      if (!formData.password?.trim()) {
        newErrors.password = "Password harus diisi";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }
    }

    if (
      formData.whatsapp_number?.trim() &&
      !/^\d{10,}$/.test(formData.whatsapp_number.replace(/\D/g, ""))
    ) {
      newErrors.whatsapp_number = "Nomor WhatsApp tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field as keyof UserFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));

    if (errors.role) {
      setErrors((prev) => ({
        ...prev,
        role: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (onConfirmDelete) {
      setIsLoading(true);
      try {
        await onConfirmDelete();
        setShowDeleteConfirm(false);
        onClose();
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!editingUser;
  const modalTitle = isEditMode ? "Edit User" : "Tambah User Baru";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{modalTitle}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {showDeleteConfirm && isEditMode ? (
            // Delete Confirmation
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Konfirmasi Penghapusan
              </h4>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus user{" "}
                <strong>{editingUser?.name}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menghapus...
                    </>
                  ) : (
                    "Hapus"
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "lecturer", "student"] as UserRole[]).map(
                    (role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                          formData.role === role
                            ? role === "admin"
                              ? "bg-red-600 text-white"
                              : role === "lecturer"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {role === "admin"
                          ? "Admin"
                          : role === "lecturer"
                          ? "Dosen"
                          : "Mahasiswa"}
                      </button>
                    )
                  )}
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nama lengkap"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* NIP - For Admin and Lecturer */}
              {formData.role !== "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIP *
                  </label>
                  <input
                    type="text"
                    value={formData.nip || ""}
                    onChange={(e) => handleInputChange("nip", e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                      errors.nip ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nomor Induk Pegawai"
                  />
                  {errors.nip && (
                    <p className="text-red-500 text-sm mt-1">{errors.nip}</p>
                  )}
                </div>
              )}

              {/* NIM - For Student */}
              {formData.role === "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIM *
                  </label>
                  <input
                    type="text"
                    value={formData.nim || ""}
                    onChange={(e) => handleInputChange("nim", e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                      errors.nim ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nomor Induk Mahasiswa"
                  />
                  {errors.nim && (
                    <p className="text-red-500 text-sm mt-1">{errors.nim}</p>
                  )}
                </div>
              )}

              {/* Initials - Only for Lecturer */}
              {formData.role !== "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inisial *
                  </label>
                  <input
                    type="text"
                    value={formData.initials || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "initials",
                        e.target.value.toUpperCase().slice(0, 5)
                      )
                    }
                    disabled={isLoading}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                      errors.initials ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Maksimal 5 karakter (cth: DR)"
                  />
                  {errors.initials && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.initials}
                    </p>
                  )}
                </div>
              )}

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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp_number || ""}
                  onChange={(e) =>
                    handleInputChange("whatsapp_number", e.target.value)
                  }
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                    errors.whatsapp_number
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="62812345678"
                />
                {errors.whatsapp_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.whatsapp_number}
                  </p>
                )}
              </div>

              {/* Password */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Minimal 6 karakter"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Hapus
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? "Updating..." : "Menyimpan..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? "Update" : "Simpan"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
