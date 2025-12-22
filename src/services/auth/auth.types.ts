// Custom AuthUser based on JWT claims
export interface AuthUser {
  user_id: string;
  username: string;
  email: string;
  role: string;
  user_reseller_id?: string;
  emailVerified?: boolean; // Email verification status (from profile)
}

// API response for authentication endpoints
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds until access token expires
}

export interface LoginCredentials {
  login: string; // email or username
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  fullName: string;
  captchaToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
