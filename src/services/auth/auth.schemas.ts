import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
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
    email: z
      .string()
      .min(1, 'Email là bắt buộc')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z
      .string()
      .min(1, 'Xác nhận mật khẩu là bắt buộc')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  });

// Password reset schema
export const resetPasswordSchema = z.object({
  email: z.email('Email không hợp lệ')
});

// Type inference for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;