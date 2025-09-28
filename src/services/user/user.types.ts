// User profile response from API
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  phone_number?: string;
  role: string;
  avatar_url?: string;
  balance: number;
  is_banned: boolean;
  ban_reason?: string;

  // Bổ sung
  address?: string;
  country?: string;
  zip?: string;
  company?: string;
  vatId?: string;
}

// Update profile request
export interface UpdateProfileRequest {
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
}

// Update profile response
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

// User role types
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  RESELLER = 'reseller'
}

// Extended user data for auth store
export interface AuthUser extends UserProfile {
  firebaseUid?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
