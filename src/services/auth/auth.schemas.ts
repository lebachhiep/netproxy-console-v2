import { z } from 'zod';

// Login form schema (accepts email or username)
export const loginSchema = z.object({
  login: z.string().min(1, 'Email hoặc tên đăng nhập là bắt buộc').toLowerCase(),
  password: z.string().min(1, 'Mật khẩu là bắt buộc').min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  remember: z.boolean().default(false)
});

// Register form schema
export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Họ tên là bắt buộc').max(255, 'Họ tên không được vượt quá 255 ký tự'),
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ').toLowerCase(),
    username: z
      .string()
      .min(1, 'Tên đăng nhập là bắt buộc')
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .max(30, 'Tên đăng nhập không được vượt quá 30 ký tự')
      .regex(/^[a-z0-9]+$/, 'Tên đăng nhập chỉ được chứa chữ thường và số')
      .toLowerCase(),
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  });

// Password forgot schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ').toLowerCase()
});

// Password reset schema (basic - used when token is in URL)
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  });

// Confirm password reset schema (with OTP token - used for forgot password flow)
export const confirmResetPasswordSchema = z
  .object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ').toLowerCase(),
    token: z
      .string()
      .min(1, 'Mã xác thực là bắt buộc')
      .length(6, 'Mã xác thực phải có 6 chữ số')
      .regex(/^\d{6}$/, 'Mã xác thực chỉ được chứa số'),
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  });

// Change password schema (for authenticated users changing their own password)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc').min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    newPassword: z
      .string()
      .min(1, 'Mật khẩu mới là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmNewPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmNewPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword']
  });

// User profile schema - matches backend GetMeResponse
export const userProfileSchema = z.object({
  id: z.string().uuid('ID không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự').max(30, 'Tên đăng nhập không được vượt quá 30 ký tự'),
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100, 'Họ tên không được vượt quá 100 ký tự').optional().nullable(),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, 'Số điện thoại không hợp lệ')
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự')
    .optional()
    .nullable(),
  role: z.string(),
  avatar_url: z.string().url('URL avatar không hợp lệ').max(255, 'URL không được vượt quá 255 ký tự').optional().nullable(),
  balance: z.number().nonnegative('Số dư không được âm'),
  is_banned: z.boolean(),
  ban_reason: z.string().optional().nullable(),
  total_purchased: z.number().nonnegative('Tổng mua không được âm')
});

// Type inference for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ConfirmResetPasswordFormData = z.infer<typeof confirmResetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
