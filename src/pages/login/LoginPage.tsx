import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { Checkbox } from '@/components/checkbox/Checkbox';
import { EmojiLaugh, Google, LockClosed } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/services/auth/auth.schemas';
import { useAuth } from '@/hooks/useAuth';
import { mapFirebaseError } from '@/utils/errors';
import { AUTH_MESSAGES, AUTH_ROUTES, PROTECTED_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { AuthShowcase } from './components/AuthShowCase';
import bgAuth from '/images/bg_auth.png';
import group7 from '@/assets/images/group-7.png';
import img9 from '@/assets/images/image-9.png';
import productCardImg from '@/assets/images/product-card.png';
import pcImg from '@/assets/images/pc.png';

interface LocationState {
  from?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const { login, loginWithGoogle, isAuthenticated, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = locationState?.from || PROTECTED_ROUTES.HOME;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, locationState]);

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, data.remember || false);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      const from = locationState?.from || PROTECTED_ROUTES.HOME;
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = mapFirebaseError(error);
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      const from = locationState?.from || PROTECTED_ROUTES.HOME;
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = mapFirebaseError(error);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout
      left={
        <AuthFormWrapper title="Đăng Nhập" subtitle="Chào mừng bạn đã quay trở lại !">
          {/* Google Button */}
          <div className="flex flex-col gap-5 p-5 md:p-0 shadow-lg md:shadow-none rounded-[20px] border md:border-none border-border-element dark:border-border-element-dark">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="bg-bg-secondary h-12 dark:bg-bg-secondary-dark dark:pseudo-border-top flex items-center justify-center gap-3 w-full py-3 px-5 border-[1.25px] border-border-element dark:border-border-element-dark rounded-full shadow-xs hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Google />
              <span className="font-bold text-text-hi dark:text-text-hi-dark text-[12px] tracking-[0.6px]">GOOGLE</span>
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
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <InputField
                          {...field}
                          type="email"
                          placeholder="Tài khoản"
                          icon={<EmojiLaugh className="text-primary" />}
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
                          placeholder="Nhập mật khẩu"
                          icon={<LockClosed className="text-blue" />}
                          showPasswordToggle
                          disabled={isSubmitting}
                        />
                        {errors.password && <span className="text-red text-sm mt-1">{errors.password.message}</span>}
                      </div>
                    )}
                  />

                  <Link to={AUTH_ROUTES.FORGOT_PASSWORD} className="text-blue text-sm text-underline text-end font-medium">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Controller
                  name="remember"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <label className="flex items-center gap-2 w-fit">
                      <Checkbox checked={value} onChange={onChange} disabled={isSubmitting} />
                      <span className="font-normal text-sm text-text-hi dark:text-text-hi-dark">Lưu trạng thái đăng nhập</span>
                    </label>
                  )}
                />

                {errors.root && <div className="text-red text-sm text-center">{errors.root.message}</div>}

                <div className="flex flex-col gap-5">
                  <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
            Bạn chưa có tài khoản?{' '}
            <Link to={AUTH_ROUTES.REGISTER} className="text-blue text-underline">
              Đăng ký
            </Link>
          </p>
        </AuthFormWrapper>
      }
      right={
        <div className="md:w-[414px] lg:w-[720px] justify-center items-center gap-1 p-5 lg:pr-0 hidden md:flex relative">
          <AuthShowcase
            bg={bgAuth}
            images={[
              {
                src: group7,
                className: 'absolute w-[119px] lg:h-[141px] top-[15px] md:right-10 lg:left-[516px] mix-blend-soft-light'
              },
              {
                src: img9,
                className:
                  'aspect-[91/60] md:w-[360px] lg:w-[606px] lg:h-[405px] md:top-[183px] lg:top-[100px] lg:left-[37px] absolute object-contain'
              },
              {
                src: productCardImg,
                className: 'aspect-[101/108] h-[193px] top-[360px] md:right-12 lg:left-[479px] absolute object-contain'
              },
              {
                src: pcImg,
                className: 'absolute w-[132px] lg:h-[154px] top-[274px] left-0 object-contain'
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
