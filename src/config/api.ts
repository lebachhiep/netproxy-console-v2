import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens, getTokenStorageType } from '@/utils/token';

// Extend AxiosRequestConfig to include our custom _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Refresh token promise to prevent multiple simultaneous refresh calls
let refreshTokenPromise: Promise<string> | null = null;

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staging-api.prx.network';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth for public endpoints
    if (
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/request-password-reset') ||
      config.url?.includes('/auth/reset-password') ||
      config.url?.includes('/auth/verify-email') ||
      config.url?.includes('/auth/refresh')
    ) {
      return config;
    }

    // Get access token and add to headers
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Refresh the access token using the refresh token
 * Uses a promise to prevent multiple simultaneous refresh calls
 */
const refreshAccessToken = async (): Promise<string> => {
  // If a refresh is already in progress, wait for it
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  // Start a new refresh
  refreshTokenPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {
          refresh_token: refreshToken
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Determine if we should use localStorage or sessionStorage
      // by checking where the tokens are currently stored
      const storageType = getTokenStorageType();
      const wasRemembered = storageType === 'localStorage';

      // Save new tokens
      saveTokens(response.data, wasRemembered);

      return response.data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login on refresh failure
      clearTokens();
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw error;
    } finally {
      // Clear the promise so future requests can trigger a new refresh
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest?._retry && originalRequest) {
      // Prevent infinite retry loops
      originalRequest._retry = true;

      // Skip refresh for auth endpoints
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      try {
        // Try to refresh the access token
        const newAccessToken = await refreshAccessToken();

        // Retry the original request with new token
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, error already handled in refreshAccessToken
        return Promise.reject(refreshError);
      }
    }

    // Handle other error responses
    if (error.response) {
      const { status, data } = error.response as { status: number; data: any };

      switch (status) {
        case 400:
          toast.error(data?.message || 'Yêu cầu không hợp lệ');
          break;
        case 403:
          toast.error('Bạn không có quyền thực hiện hành động này');
          break;
        case 404:
          toast.error('Không tìm thấy dữ liệu');
          break;
        case 500:
          toast.error('Lỗi máy chủ. Vui lòng thử lại sau');
          break;
        default:
          toast.error(data?.message || 'Đã xảy ra lỗi');
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Không thể kết nối đến máy chủ');
    } else {
      // Something else happened
      toast.error('Đã xảy ra lỗi');
    }

    return Promise.reject(error);
  }
);

// Export API configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  getAuthToken: () => {
    return getAccessToken();
  }
};
