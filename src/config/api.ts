import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { getAccessToken, isTokenExpired, getRefreshToken, saveTokens, clearTokens } from '@/utils/token';

// Extend AxiosRequestConfig to include our custom _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://v2.dev.api.netproxy.io';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Skip auth for public endpoints
      if (config.url?.includes('/auth/login') ||
          config.url?.includes('/auth/register') ||
          config.url?.includes('/auth/request-password-reset') ||
          config.url?.includes('/auth/reset-password') ||
          config.url?.includes('/auth/verify-email')) {
        return config;
      }

      // Check if token is expired and try to refresh
      if (isTokenExpired() && !config.url?.includes('/auth/refresh')) {
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            // Call refresh endpoint
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refresh_token: refreshToken
            });

            // Save new tokens
            const wasRemembered = !!localStorage.getItem('access_token');
            saveTokens(response.data, wasRemembered);
          }
        } catch (refreshError) {
          console.error('Token refresh failed in interceptor:', refreshError);
          clearTokens();
          // Let the request continue, it will fail with 401 and be handled by response interceptor
        }
      }

      // Get access token and add to headers
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error in request interceptor:', error);
      // Continue with request even if token handling fails
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest?._retry && originalRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
          // Try to refresh the access token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          // Save new tokens
          const wasRemembered = !!localStorage.getItem('access_token');
          saveTokens(response.data, wasRemembered);

          // Retry the original request with new token
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
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
  },
};