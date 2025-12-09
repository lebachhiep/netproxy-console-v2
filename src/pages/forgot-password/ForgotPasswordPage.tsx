import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/services/auth/auth.schemas';
import { useAuth } from '@/hooks/useAuth';
import { mapApiError } from '@/utils/errors';
import { AUTH_MESSAGES, AUTH_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';

export const ForgotPasswordPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: 'Quên mật khẩu' });
  const navigate = useNavigate();
  const { resetPassword, isAuthenticated, clearError } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema) as any,
    defaultValues: {
      email: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      if (!executeRecaptcha) {
        toast.error(t('recaptchaNotReady'));
        return;
      }

      const captchaToken = await executeRecaptcha('password_reset');

      await resetPassword(data.email, captchaToken);
      toast.success(AUTH_MESSAGES.PASSWORD_RESET_SENT);
      setEmailSent(true);
      reset(); // Clear the form
    } catch (error) {
      const errorMessage = mapApiError(error);
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    }
  };

  return (
    <>
      {pageTitle}
      <div className="relative flex p-6 items-center justify-center min-h-[100dvh] bg-bg-canvas dark:bg-bg-canvas-dark">
        {!emailSent ? (
          <AuthFormWrapper title="Lấy lại mật khẩu" subtitle="Vui lòng nhập email đã đăng ký">
            <div className="p-5 shadow-lg rounded-[20px] border border-border-element dark:border-border-element-dark">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField {...field} type="email" placeholder="Nhập email" disabled={isSubmitting} />
                          {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>
                      )}
                    />
                  </div>

                  {errors.root && <div className="text-red-500 text-sm text-center">{errors.root.message}</div>}

                  <div className="flex flex-col gap-3">
                    <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Đang gửi...' : 'XÁC THỰC'}
                    </Button>

                    <Link to={AUTH_ROUTES.LOGIN} className="text-blue text-sm text-center hover:underline">
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
              Bạn chưa có tài khoản?{' '}
              <Link to={AUTH_ROUTES.REGISTER} className="text-blue hover:underline">
                Đăng ký
              </Link>
            </p>
          </AuthFormWrapper>
        ) : (
          <div className="flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-3 max-w-[512px]">
              <h3>Đã gởi mail</h3>
              <p className="text-base text-text-hi dark:text-text-hi-dark">
                Chúng tôi đã gởi mail cho bạn. Vui lòng kiểm tra email và bấm vào đường dẫn để đặt lại mật khẩu. Hoặc{' '}
                <a href="#" className="text-blue underline font-medium" onClick={() => setEmailSent(false)}>
                  gởi lại email
                </a>
              </p>
              <div>
                <Button variant="default" className="px-8 uppercase" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                  TRỞ LẠI ĐĂNG NHẬP
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">© Netproxy</div>
      </div>
    </>
  );
};
