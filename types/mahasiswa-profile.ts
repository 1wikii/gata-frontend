export interface MahasiswaProfile {
  id: number;
  name: string;
  nim: string;
  email: string;
  password?: string;
  whatsapp_number?: string;
  pembimbing_1?: string;
  pembimbing_2?: string;
  judul_tugas_akhir?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MahasiswaProfileFormState {
  name: string;
  nim: string;
  email: string;
  whatsapp_number?: string;
  password?: string;
}

export interface MahasiswaProfileFormErrors {
  name?: string;
  nim?: string;
  email?: string;
  whatsapp_number?: string;
  password?: string;
}
