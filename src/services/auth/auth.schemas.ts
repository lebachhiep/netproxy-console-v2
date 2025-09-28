import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc').min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  remember: z.boolean().default(false)
});

// Register form schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Họ tên là bắt buộc')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .max(50, 'Họ tên không được vượt quá 50 ký tự'),
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
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
  email: z.email('Email không hợp lệ')
});

// Password reset schema
export const resetPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 số')
    .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt')
    .optional(),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 số')
    .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
});

// User profile schema
export const userProfileSchema = z.object({
  id: z.string().uuid('ID không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự').max(30, 'Tên đăng nhập không được vượt quá 30 ký tự'),
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(50, 'Họ tên không được vượt quá 50 ký tự').optional(),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, 'Số điện thoại không hợp lệ')
    .optional(),
  role: z.string(),
  avatar_url: z.string().url('URL avatar không hợp lệ').optional(),
  balance: z.number().nonnegative('Số dư không được âm'),
  is_banned: z.boolean(),
  ban_reason: z.string().optional(),

  // Bổ sung địa chỉ
  address: z.string().max(100, 'Địa chỉ không được vượt quá 100 ký tự').optional(),
  country: z.string().max(50, 'Quốc gia không được vượt quá 50 ký tự').optional(),
  zip: z
    .string()
    .regex(/^\d{4,10}$/, 'Mã Zip không hợp lệ')
    .optional(),
  company: z.string().max(100, 'Tên công ty không được vượt quá 100 ký tự').optional(),
  vatId: z.string().max(30, 'VAT ID không được vượt quá 30 ký tự').optional()
});

// Type inference for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
