import { apiService } from '@/services/api/api.service';
import { UserProfile, UpdateProfileRequest, UpdateProfileResponse, PlatformStat, RotateApiKeyResponse } from './user.types';

class UserService {
  /**
   * Get current authenticated user profile
   * GET /user/account/me
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiService.get<UserProfile>('/user/account/me');
      return response;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * PUT /user/account/profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await apiService.put<UpdateProfileResponse>('/user/account/profile', data);
      return response;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }
  async getPlatformStat(): Promise<PlatformStat> {
    try {
      const response = await apiService.get<PlatformStat>('user/platform-stats');
      return response;
    } catch (error) {
      console.error('Lỗi lấy Flatform status');
      throw error;
    }
  }
  /**
   * Check if user profile is complete
   */
  isProfileComplete(profile: UserProfile): boolean {
    return !!(profile.full_name && profile.phone_number);
  }

  /**
   * Format balance for display
   */
  formatBalance(balance: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(balance);
  }

  /**
   * Get user display name (prioritize full_name over username)
   */
  getDisplayName(profile: UserProfile): string {
    return profile.full_name || profile.username || profile.email;
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(profile: UserProfile): string {
    const name = this.getDisplayName(profile);
    const words = name.split(' ');

    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }

  /**
   * Check if user has admin privileges
   */
  isAdmin(profile: UserProfile): boolean {
    return profile.role === 'admin';
  }

  /**
   * Check if user has moderator privileges
   */
  isModerator(profile: UserProfile): boolean {
    return profile.role === 'moderator' || profile.role === 'admin';
  }

  /**
   * Rotate (generate new) API key
   * POST /user/api-key/rotate
   * Note: The API key can only be viewed once after rotation
   */
  async rotateApiKey(): Promise<RotateApiKeyResponse> {
    try {
      const response = await apiService.post<RotateApiKeyResponse>('/user/api-key/rotate', {});
      return response;
    } catch (error) {
      console.error('Failed to rotate API key:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * POST /user/account/change-password
   * Note: This will revoke all refresh tokens (forces re-login on all devices)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/user/account/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();

// Export the class for extending if needed
export default UserService;
