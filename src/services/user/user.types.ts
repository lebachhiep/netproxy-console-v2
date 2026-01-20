// User profile response from API - matches GetMeResponse from backend
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name?: string | null;
  phone_number?: string | null;
  role: string;
  avatar_url?: string | null;
  balance: number;
  is_banned: boolean;
  ban_reason?: string | null;
  total_purchased: number;
}

// Update profile request - matches UpdateProfileRequest from backend
export interface UpdateProfileRequest {
  full_name?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
}

// Update profile response - matches UpdateProfileResponse from backend
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

// User role types
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface PlatformStat {
  total_users: number;
  total_orders: number;
  total_relay_nodes: number;
}

// API Key rotation response
export interface RotateApiKeyResponse {
  api_key: string;
}
