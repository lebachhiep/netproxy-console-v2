import { FirebaseError } from 'firebase/app';
import { AxiosError } from 'axios';

// Map Firebase error codes to user-friendly Vietnamese messages
export const mapFirebaseError = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    const errorMessages: Record<string, string> = {
      // Authentication errors
      'auth/user-not-found': 'Email không tồn tại trong hệ thống',
      'auth/wrong-password': 'Mật khẩu không chính xác',
      'auth/invalid-credential': 'Thông tin đăng nhập không hợp lệ',
      'auth/email-already-in-use': 'Email đã được sử dụng',
      'auth/weak-password': 'Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn',
      'auth/invalid-email': 'Email không hợp lệ',
      'auth/operation-not-allowed': 'Phương thức đăng nhập này chưa được kích hoạt',
      'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
      'auth/too-many-requests': 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau',
      'auth/network-request-failed': 'Lỗi kết nối mạng, vui lòng kiểm tra kết nối internet',
      'auth/popup-closed-by-user': 'Đăng nhập bị hủy',
      'auth/unauthorized-domain': 'Domain không được phép',
      'auth/invalid-verification-code': 'Mã xác thực không hợp lệ',
      'auth/invalid-verification-id': 'ID xác thực không hợp lệ',
      'auth/missing-verification-code': 'Thiếu mã xác thực',
      'auth/missing-verification-id': 'Thiếu ID xác thực',
      'auth/email-not-verified': 'Email chưa được xác thực',
      'auth/expired-action-code': 'Mã xác thực đã hết hạn',
      'auth/invalid-action-code': 'Mã xác thực không hợp lệ',
      'auth/credential-already-in-use': 'Thông tin đăng nhập đã được sử dụng',
      'auth/popup-blocked': 'Cửa sổ đăng nhập bị chặn bởi trình duyệt',
      'auth/requires-recent-login': 'Vui lòng đăng nhập lại để thực hiện thao tác này',
      'auth/account-exists-with-different-credential': 'Tài khoản đã tồn tại với phương thức đăng nhập khác'
    };

    return errorMessages[error.code] || error.message || 'Đã xảy ra lỗi, vui lòng thử lại';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra lỗi không xác định';
};

// Check if error is a Firebase error
export const isFirebaseError = (error: unknown): error is FirebaseError => {
  return error instanceof FirebaseError;
};

// Get error code from Firebase error
export const getFirebaseErrorCode = (error: unknown): string | null => {
  if (isFirebaseError(error)) {
    return error.code;
  }
  return null;
};

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