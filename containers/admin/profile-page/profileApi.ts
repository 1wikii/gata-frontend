import {
  AdminProfile,
  AdminProfileFormState,
  ExpertiseGroup,
} from "@/types/admin-profile";
import { api } from "@/utils/api";

// Fetch admin profile (current logged-in user)
export const fetchAdminProfile = async (): Promise<AdminProfile> => {
  const response = await api.get("/admin/profile");
  if (!response.ok) {
    throw new Error("Gagal mengambil data profil");
  }
  const data = await response.json();
  return data.data;
};

// Fetch expertise groups
export const fetchExpertiseGroups = async (): Promise<ExpertiseGroup[]> => {
  const response = await api.get("/admin/profile/kelompok-keahlian");
  if (!response.ok) {
    throw new Error("Gagal mengambil data kelompok keahlian");
  }
  const data = await response.json();
  return data.data || [];
};

/**
 * Update admin profile
 *
 * Updates admin profile information including personal data, expertise groups, password, and signature.
 *
 * @param formData - Admin profile form data with all required and optional fields
 * @returns Updated AdminProfile with all fields including signature
 * @throws Error if API request fails or validation error
 *
 */
export const updateAdminProfile = async (
  formData: AdminProfileFormState
): Promise<AdminProfile> => {
  // Build payload with required fields
  const payload: any = {
    name: formData.name,
    email: formData.email,
    nip: formData.nip,
    initials: formData.initials,
    expertise_group_1: formData.expertise_group_1,
    expertise_group_2: formData.expertise_group_2,
  };

  // Add optional expertise groups (only if they have values)
  if (
    formData.expertise_group_3 !== undefined &&
    formData.expertise_group_3 !== null
  ) {
    payload.expertise_group_3 = formData.expertise_group_3;
  }

  if (
    formData.expertise_group_4 !== undefined &&
    formData.expertise_group_4 !== null
  ) {
    payload.expertise_group_4 = formData.expertise_group_4;
  }

  // Add optional WhatsApp number if provided (non-empty string)
  if (formData.whatsapp_number?.trim()) {
    payload.whatsapp_number = formData.whatsapp_number.trim();
  }

  // Add optional password if provided (non-empty string)
  if (formData.password?.trim()) {
    payload.password = formData.password.trim();
  }

  // Add optional signature if provided (non-empty string)
  // Format: "data:image/png;base64,..." or "data:image/jpeg;base64,..."
  if (formData.signature_data?.trim()) {
    payload.signature_data = formData.signature_data.trim();
  }

  const response = await api.put("/admin/profile", payload);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menyimpan profil");
  }

  const data = await response.json();
  return data.data;
};

