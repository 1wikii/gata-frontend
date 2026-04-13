export interface ExpertiseGroup {
  id: number;
  name: string;
  description?: string;
}

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  nip: string;
  initials: string;
  whatsapp_number?: string;
  expertise_group_1?: number | null;
  expertise_group_2?: number | null;
  expertise_group_3?: number | null;
  expertise_group_4?: number | null;
  signature_url?: string; // URL to the signature image
  signature_data?: string; // Base64 encoded signature data (for database storage)
  created_at: string;
  updated_at: string;
}

export interface AdminProfileFormState {
  name: string;
  email: string;
  nip: string;
  initials: string;
  whatsapp_number?: string;
  password?: string;
  signature_data?: string; // Base64 encoded signature
  expertise_group_1: number;
  expertise_group_2: number;
  expertise_group_3: number;
  expertise_group_4: number;
}

export interface AdminProfileFormErrors {
  name?: string;
  email?: string;
  nip?: string;
  initials?: string;
  whatsapp_number?: string;
  password?: string;
  signature_data?: string;
  expertise_group_1?: string;
  expertise_group_2?: string;
  expertise_group_3?: string;
  expertise_group_4?: string;
}
