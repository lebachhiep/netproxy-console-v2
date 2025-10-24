import { AxiosError } from 'axios';

// Map API error to user-friendly Vietnamese message
export const mapApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Check for response errors
    if (error.response) {
      const { status, data } = error.response;

      // Return server-provided message if available
      if (data?.message) {
        return data.message;
      }

      // Return status-specific messages
      switch (status) {
        case 400:
          return 'Yêu cầu không hợp lệ';
        case 401:
          return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại';
        case 403:
          return 'Bạn không có quyền thực hiện hành động này';
        case 404:
          return 'Không tìm thấy dữ liệu';
        case 409:
          return 'Dữ liệu bị xung đột';
        case 422:
          return 'Dữ liệu không hợp lệ';
        case 429:
          return 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
        case 500:
          return 'Lỗi máy chủ. Vui lòng thử lại sau';
        case 502:
          return 'Máy chủ không phản hồi';
        case 503:
          return 'Dịch vụ tạm thời không khả dụng';
        case 504:
          return 'Yêu cầu hết thời gian chờ';
        default:
          return `Lỗi máy chủ (${status})`;
      }
    }

    // Check for request errors (no response)
    if (error.request) {
      if (error.code === 'ECONNABORTED') {
        return 'Yêu cầu hết thời gian chờ';
      }
      if (error.code === 'ERR_NETWORK') {
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet';
      }
      return 'Không thể kết nối đến máy chủ';
    }

    // Other axios errors
    return error.message || 'Đã xảy ra lỗi khi gọi API';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra lỗi không xác định';
};

// Check if error is an API error
export const isApiError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

// Get API error status code
export const getApiErrorStatus = (error: unknown): number | null => {
  if (isApiError(error) && error.response) {
    return error.response.status;
  }
  return null;
};