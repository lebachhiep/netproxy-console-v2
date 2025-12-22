// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const RememberMeTicked = 'RememberMeTicked';
// JWT payload interface
export interface JWTPayload {
  sub: string; // subject (user_id)
  username: string;
  role?: string;
  user_reseller_id?: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

// Auth tokens interface
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Save authentication tokens to storage
 * @param tokens - Access and refresh tokens with expiry
 * @param rememberMe - If true, use localStorage; otherwise use sessionStorage
 */
export const saveTokens = (tokens: AuthTokens, rememberMe: boolean): void => {
  const storage = rememberMe ? localStorage : sessionStorage;

  localStorage.setItem(RememberMeTicked, rememberMe ? 'true' : 'false');
  storage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);

  // Calculate expiry timestamp (current time + expires_in seconds)
  const expiryTimestamp = Date.now() + tokens.expires_in * 1000;
  storage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
};

/**
 * Get access token from storage
 * @returns Access token or null if not found
 */
export const getAccessToken = (): string | null => {
  // Check sessionStorage first (for current session), then localStorage (for "remember me")
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from storage
 * @returns Refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get token expiry timestamp from storage
 * @returns Expiry timestamp or null if not found
 */
export const getTokenExpiry = (): number | null => {
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY) || localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

/**
 * Check if access token is expired
 * @returns True if token is expired or not found
 */
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;

  // Add 60 second buffer to refresh before actual expiry
  return Date.now() >= expiry - 60000;
};

/**
 * Validate access token by checking JWT expiry
 * @returns True if token exists and is not expired
 */
export const isAccessTokenValid = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  const payload = decodeJWT(token);
  if (!payload) return false;

  // Check if token is expired (JWT exp is in seconds, Date.now() is in milliseconds)
  // Add 60 second buffer to refresh before actual expiry
  const expiryTime = payload.exp * 1000;
  return Date.now() < expiryTime - 60000;
};

/**
 * Validate refresh token by checking JWT expiry
 * @returns True if refresh token exists and is not expired
 */
export const isRefreshTokenValid = (): boolean => {
  const token = getRefreshToken();
  if (!token) return false;

  const payload = decodeJWT(token);
  if (!payload) return false;

  // Check if token is expired (JWT exp is in seconds)
  const expiryTime = payload.exp * 1000;
  return Date.now() < expiryTime;
};

/**
 * Get the storage type currently being used for tokens
 * @returns 'localStorage' if tokens are in localStorage, 'sessionStorage' if in sessionStorage, or null if no tokens
 */
export const getTokenStorageType = (): 'localStorage' | 'sessionStorage' | null => {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
    return 'localStorage';
  }
  if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    return 'sessionStorage';
  }
  return null;
};

/**
 * Clear all authentication tokens from storage
 */
export const clearTokens = (): void => {
  // Clear from both storages
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(TOKEN_EXPIRY_KEY);
  });
};

/**
 * Decode JWT token payload without verification
 * Note: This does NOT verify the signature, only decodes the payload
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Get user info from stored access token
 * @returns AuthUser object or null
 */
export const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodeJWT(token);
  if (!payload) return null;

  // Map JWT payload to AuthUser format
  return {
    user_id: payload.sub,
    username: payload.username,
    email: payload.username, // Use username as email placeholder until profile is fetched
    role: payload.role || 'user',
    user_reseller_id: payload.user_reseller_id,
    emailVerified: false // Will be updated when profile is fetched
  };
};

/**
 * Check if tokens exist in storage
 * @returns True if both access and refresh tokens exist
 */
export const hasTokens = (): boolean => {
  return !!(getAccessToken() && getRefreshToken());
};
//Save the saving button?
