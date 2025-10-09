import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { Google } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData, registerSchema } from '@/services/auth/auth.schemas';
import { AUTH_MESSAGES, AUTH_ROUTES } from '@/utils/constants';
import { mapFirebaseError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
    <div className="flex p-6 items-center justify-center min-h-screen bg-bg-canvas dark:bg-bg-canvas-dark">
      <AuthFormWrapper title="Đăng Ký" subtitle="Vui lòng nhập thông tin đăng ký!">
        <div className="p-5 shadow-lg rounded-[20px] border border-border-element dark:border-border-element-dark">
          <div className="flex flex-col gap-5">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isSubmitting}
              className="bg-bg-secondary h-12 dark:bg-bg-secondary-dark dark:border-top-dark flex items-center justify-center gap-3 w-full py-3 px-5 border-[1.25px] border-border-element dark:border-border-element-dark rounded-full shadow-xs hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Google />
              <span className="font-bold text-text-hi dark:text-text-hi-dark text-[12px] tracking-[0.6px]">ĐĂNG KÝ VỚI GOOGLE</span>
            </button>
            {/* Divider */}
            <div className="flex items-center w-full">
              <div className="flex-grow border-t border-border-element dark:border-border-element-dark"></div>
              <span className="mx-3 text-text-lo text-sm">Hoặc</span>
              <div className="flex-grow border-t border-border-element dark:border-border-element-dark"></div>
            </div>

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
                          // icon={<Person className="text-blue" />}
                          disabled={isSubmitting}
                        />
                        {errors.fullName && <span className="text-red text-sm mt-1">{errors.fullName.message}</span>}
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
                          // icon={<EmojiLaugh className="text-blue" />}
                          disabled={isSubmitting}
                        />
                        {errors.email && <span className="text-red text-sm mt-1">{errors.email.message}</span>}
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
                          placeholder="Mật khẩu"
                          // icon={<LockClosed className="text-primary" />}
                          showPasswordToggle
                          disabled={isSubmitting}
                        />
                        {errors.password && <span className="text-red text-sm mt-1">{errors.password.message}</span>}
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
                          placeholder="Nhập lại mật khẩu"
                          // icon={<Lock className="text-primary" />}
                          showPasswordToggle
                          disabled={isSubmitting}
                        />
                        {errors.confirmPassword && <span className="text-red text-sm mt-1">{errors.confirmPassword.message}</span>}
                      </div>
                    )}
                  />
                </div>

                {errors.root && <div className="text-red text-sm text-center">{errors.root.message}</div>}

                <div className="flex flex-col gap-5">
                  <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Đang tạo tài khoản...' : 'TẠO TÀI KHOẢN'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
          Bạn đã có tài khoản?{' '}
          <Link to={AUTH_ROUTES.LOGIN} className="text-blue hover:underline">
            Đăng nhập
          </Link>
        </p>
      </AuthFormWrapper>
      <div className="absolute bottom-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">© Netproxy</div>
    </div>
  );
};
