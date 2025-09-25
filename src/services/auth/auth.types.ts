import { User } from 'firebase/auth';

export interface AuthUser extends User {
  // Extended user properties if needed
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}