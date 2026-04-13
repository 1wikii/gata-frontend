export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface RegisterData {
  nim: string;
  semester: number;
  name: string;
  whatsapp_number: string;
  email: string;
  password: string;
}
export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface WithAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

// export interface ForgotPassword
