import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { auth } from './firebase';
import { toast } from 'sonner';

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
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Get the ID token from Firebase
        const idToken = await currentUser.getIdToken();
        if (idToken) {
          // Add Bearer token to Authorization header
          config.headers.Authorization = `Bearer ${idToken}`;
        }
      }
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
      // Continue with request even if token retrieval fails
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
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Force refresh the ID token
          const newToken = await currentUser.getIdToken(true);
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login if token refresh fails
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
  getAuthToken: async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  },
};