import {
  MahasiswaProfile,
  MahasiswaProfileFormState,
} from "@/types/mahasiswa-profile";
import { api } from "@/utils/api";

// Fetch mahasiswa profile (current logged-in user)
export const fetchMahasiswaProfile = async (): Promise<MahasiswaProfile> => {
  const response = await api.get(`/mahasiswa/profile`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data profil");
  }
  const data = await response.json();
  return data.data;
};

// Update mahasiswa profile
export const updateMahasiswaProfile = async (
  formData: MahasiswaProfileFormState
): Promise<MahasiswaProfile> => {
  const payload: any = {
    name: formData.name,
    email: formData.email,
    nim: formData.nim,
  };

  // Add optional fields
  if (formData.whatsapp_number) {
    payload.whatsapp_number = formData.whatsapp_number;
  }

  if (formData.password?.trim()) {
    payload.password = formData.password;
  }

  const response = await api.put("/mahasiswa/profile", payload);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menyimpan profil");
  }

  const data = await response.json();
  return data.data;
};
