import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { EmojiLaugh, Google, Lock, LockClosed, Person } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/services/auth/auth.schemas';
import { useAuth } from '@/hooks/useAuth';
import { mapFirebaseError } from '@/utils/errors';
import { AUTH_MESSAGES, AUTH_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { AuthShowcase } from './components/AuthShowCase';
import bgAuth from '@/assets/images/bg_auth.png';
import group7 from '@/assets/images/group-7.png';
import img9 from '@/assets/images/image-9.png';
import productCardImg from '@/assets/images/product-card.png';
import pcImg from '@/assets/images/pc.png';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isAuthenticated, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch password for strength indicator (if needed in future)
  // const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        fullName: data.fullName
      });
      toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    } catch (error) {
      const errorMessage = mapFirebaseError(error);
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage = mapFirebaseError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout
      left={
        <AuthFormWrapper title="Đăng Ký" subtitle="Tạo tài khoản mới">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <InputField
                        {...field}
                        type="text"
                        placeholder="Nhập họ và tên"
                        icon={<Person className="text-blue" />}
                        disabled={isSubmitting}
                      />
                      {errors.fullName && (
                        <span className="text-red-500 text-sm mt-1">{errors.fullName.message}</span>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <InputField
                        {...field}
                        type="email"
                        placeholder="Nhập email"
                        icon={<EmojiLaugh className="text-blue" />}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <InputField
                        {...field}
                        type="password"
                        placeholder="Nhập mật khẩu"
                        icon={<LockClosed className="text-primary" />}
                        showPasswordToggle
                        disabled={isSubmitting}
                      />
                      {errors.password && (
                        <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <InputField
                        {...field}
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        icon={<Lock className="text-primary" />}
                        showPasswordToggle
                        disabled={isSubmitting}
                      />
                      {errors.confirmPassword && (
                        <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>
                      )}
                    </div>
                  )}
                />
              </div>

              {errors.root && (
                <div className="text-red-500 text-sm text-center">
                  {errors.root.message}
                </div>
              )}

              <div className="flex flex-col gap-5">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
                </Button>

                {/* Divider */}
                <div className="flex items-center w-full">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-3 text-gray-400 text-sm">Hoặc</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 w-full py-3 px-5 border-2 rounded-full shadow-xs hover:shadow-md transition-shadow bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Google />
                  <span className="font-medium text-gray-700">GOOGLE</span>
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-sm">
            Bạn đã có tài khoản?{' '}
            <Link to={AUTH_ROUTES.LOGIN} className="text-blue hover:underline">
              Đăng nhập
            </Link>
          </p>
        </AuthFormWrapper>
      }
      right={
        <div className="w-[720px] justify-center items-center gap-1 p-5 hidden md:flex relative">
          <AuthShowcase
            bg={bgAuth}
            images={[
              {
                src: group7,
                className: 'absolute w-[119px] h-[141px] top-[15px] left-[516px] mix-blend-soft-light'
              },
              {
                src: img9,
                className: 'aspect-[91/60] w-[606px] h-[405px] top-[100px] left-[37px] absolute object-contain'
              },
              {
                src: productCardImg,
                className: 'aspect-[101/108] w-[180px] h-[193px] top-[360px] left-[479px] absolute object-contain'
              },
              {
                src: pcImg,
                className: 'absolute w-[132px] h-[154px] top-[274px] left-0 object-contain'
              }
            ]}
            title="Proxy Tốc Độ Cao"
            description={
              <>
                Giải pháp an toàn, tăng cường bảo mật
                <br />
                và tối ưu hiệu suất kết nối.
              </>
            }
          />
        </div>
      }
    />
  );
};