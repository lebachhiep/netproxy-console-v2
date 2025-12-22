import { apiClient } from '@/config/api';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PaginatedResponse, RequestOptions, QueryParams } from './api.types';

class ApiService {
  /**
   * Generic GET request
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      params: options?.params,
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    };

    const response: AxiosResponse<T> = await apiClient.get(endpoint, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    };

    const response: AxiosResponse<T> = await apiClient.post(endpoint, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    };

    const response: AxiosResponse<T> = await apiClient.put(endpoint, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    };

    const response: AxiosResponse<T> = await apiClient.patch(endpoint, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      params: options?.params,
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    };

    const response: AxiosResponse<T> = await apiClient.delete(endpoint, config);
    return response.data;
  }

  /**
   * Upload file with multipart/form-data
   */
  async uploadFile<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>, options?: RequestOptions): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    // Append additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options?.headers
      },
      timeout: options?.timeout || 60000, // Longer timeout for file uploads
      signal: options?.signal
    };

    const response: AxiosResponse<T> = await apiClient.post(endpoint, formData, config);
    return response.data;
  }

  /**
   * Download file
   */
  async downloadFile(endpoint: string, filename?: string, options?: RequestOptions): Promise<void> {
    const config: AxiosRequestConfig = {
      responseType: 'blob',
      params: options?.params,
      headers: options?.headers,
      timeout: options?.timeout || 60000,
      signal: options?.signal
    };

    const response = await apiClient.get(endpoint, config);

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'download');
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get paginated data
   */
  async getPaginated<T = any>(endpoint: string, params?: QueryParams, options?: RequestOptions): Promise<PaginatedResponse<T>> {
    const config: AxiosRequestConfig = {
      params: {
        ...params,
        ...options?.params
      },
      headers: options?.headers,
      timeout: options?.timeout,
      signal: options?.signal
    };

    const response: AxiosResponse<PaginatedResponse<T>> = await apiClient.get(endpoint, config);
    return response.data;
  }

  /**
   * Build query string from params object
   */
  buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item));
        } else if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return queryParams.toString();
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the class for extending
export default ApiService;
