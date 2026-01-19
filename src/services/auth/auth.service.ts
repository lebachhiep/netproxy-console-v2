import { apiService } from '@/services/api/api.service';
import { AuthResponse, RegisterCredentials } from './auth.types';
import { saveTokens, getRefreshToken, clearTokens, decodeJWT, getAccessToken, getTokenStorageType } from '@/utils/token';

class AuthService {
  /**
   * Sign in with email or username and password
   * POST /auth/login
   */
  async login(login: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', {
        login,
        password
      }); // Save tokens to storage
      saveTokens(response, rememberMe);

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Register new user account
   * POST /auth/register
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        full_name: credentials.fullName,
        captcha_token: credentials.captchaToken
      });

      // Save tokens to storage (default to session storage for registration)
      saveTokens(response, false);

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiService.post('/auth/logout', {
          refresh_token: refreshToken
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear tokens locally
      clearTokens();
    }
  }

  /**
   * Refresh access token using refresh token
   * POST /auth/refresh
   */
  async refreshAccessToken(): Promise<AuthResponse> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken
      });

      // Update tokens in storage (preserve the storage type)
      const storageType = getTokenStorageType();
      const wasRemembered = storageType === 'localStorage';
      saveTokens(response, wasRemembered);

      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      clearTokens();
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw error;
    }
  }

  /**
   * Request password reset email
   * POST /auth/request-password-reset
   */
  async requestPasswordReset(email: string, captchaToken: string): Promise<void> {
    try {
      await apiService.post('/auth/request-password-reset', {
        email,
        captcha_token: captchaToken
      });
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Reset password with OTP token
   * POST /auth/reset-password
   */
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', {
        email,
        token,
        new_password: newPassword
      });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiService.post('/auth/verify-email', {
        token
      });
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }

  /**
   * Get current user from stored access token
   * Returns decoded JWT payload
   */
  getCurrentUser() {
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
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getAccessToken();
  }
}

export const authService = new AuthService();
