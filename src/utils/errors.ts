import { FirebaseError } from 'firebase/app';

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