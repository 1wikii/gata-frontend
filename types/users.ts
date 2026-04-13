export type UserRole = "admin" | "lecturer" | "student";

export interface User {
  id: number;
  nip?: string;
  nim?: string;
  initials?: string;
  name: string;
  email: string;
  role: UserRole;
  whatsapp_number?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  whatsapp_number?: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  whatsapp_number?: string;
  is_active?: boolean;
}

export interface UsersResponse {
  message: string;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserFormState {
  role: UserRole | "";
  email: string;
  name: string;
  nip?: string;
  nim?: string;
  initials?: string;
  whatsapp_number?: string;
  password?: string;
}

export interface UserFormErrors {
  role?: string;
  email?: string;
  name?: string;
  nip?: string;
  nim?: string;
  initials?: string;
  whatsapp_number?: string;
  password?: string;
}
