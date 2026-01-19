import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { OTPInput } from '@/components/input/OTPInput';
import { ConfirmResetPasswordFormData, confirmResetPasswordSchema } from '@/services/auth/auth.schemas';
import { AUTH_ROUTES } from '@/utils/constants';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useBranding } from '@/hooks/useBranding';

export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle({ pageName: t('resetPasswordPage.resetPassword') });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmResetPassword, isAuthenticated, clearError } = useAuth();
  const { businessName } = useBranding();
  const [step, setStep] = useState<1 | 2>(1);

  // Get email from query params if passed from forgot password page
  const emailFromParams = searchParams.get('email') || '';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<ConfirmResetPasswordFormData>({
    resolver: zodResolver(confirmResetPasswordSchema),
    defaultValues: {
      email: emailFromParams,
      token: '',
      password: '',
      confirmPassword: ''
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

  const onSubmit = async (data: ConfirmResetPasswordFormData) => {
    try {
      await confirmResetPassword(data.email, data.token, data.password);
      toast.success(t('resetPasswordPage.alertResetSuccess'));
      setStep(2);
    } catch (error: any) {
      const errorMessage = mapApiError(error);
      toast.error(errorMessage);

      // Set specific field errors based on backend response
      const message = error?.response?.data?.message?.toLowerCase() || '';

      if (message.includes('token') || message.includes('otp') || message.includes('code')) {
        setError('token', { message: t('resetPasswordPage.invalidToken') });
      } else if (message.includes('email')) {
        setError('email', { message: t('resetPasswordPage.invalidEmail') });
      } else if (message.includes('expired') || message.includes('het han')) {
        setError('token', { message: t('resetPasswordPage.tokenExpired') });
      } else if (message.includes('attempts') || message.includes('lan thu')) {
        setError('token', { message: t('resetPasswordPage.tooManyAttempts') });
      }

      setError('root', { message: errorMessage });
    }
  };

  return (
    <>
      {pageTitle}
      <div className="relative flex p-6 items-center justify-center min-h-[100dvh] bg-bg-canvas dark:bg-bg-canvas-dark">
        {step === 1 ? (
          <AuthFormWrapper title={t('resetPasswordPage.resetPassword')} subtitle={t('resetPasswordPage.askingForEnterPassword')}>
            <div className="p-5 shadow-lg rounded-[20px] border border-border-element dark:border-border-element-dark">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    {/* Email Field */}
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField
                            {...field}
                            type="email"
                            label="Email"
                            placeholder={t('forgotPasswordPage.inputPlaceholder')}
                            disabled={isSubmitting || !!emailFromParams}
                          />
                          {errors.email && <span className="text-red text-sm mt-1">{errors.email.message}</span>}
                        </div>
                      )}
                    />

                    {/* OTP Token Field */}
                    <Controller
                      name="token"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <OTPInput
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            error={!!errors.token}
                            label={t('resetPasswordPage.enterOTP')}
                          />
                          {errors.token && <span className="text-red text-sm mt-1 block text-center">{errors.token.message}</span>}
                        </div>
                      )}
                    />

                    {/* New Password Field */}
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField
                            {...field}
                            type="password"
                            label={t('resetPasswordPage.newPassword')}
                            placeholder={t('registerPage.pass')}
                            showPasswordToggle
                            disabled={isSubmitting}
                          />
                          {errors.password && <span className="text-red text-sm mt-1">{errors.password.message}</span>}
                        </div>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField
                            {...field}
                            type="password"
                            label={t('resetPasswordPage.confirmNewPassword')}
                            placeholder={t('registerPage.repass')}
                            showPasswordToggle
                            disabled={isSubmitting}
                          />
                          {errors.confirmPassword && <span className="text-red text-sm mt-1">{errors.confirmPassword.message}</span>}
                        </div>
                      )}
                    />
                  </div>

                  {errors.root && <div className="text-red text-sm text-center">{errors.root.message}</div>}

                  <div className="flex flex-col gap-3">
                    <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? t('resetPasswordPage.settingUp') : t('resetPasswordPage.resetPassword')}
                    </Button>

                    <Link to={AUTH_ROUTES.FORGOT_PASSWORD} className="text-blue text-sm text-center hover:underline">
                      {t('resetPasswordPage.requestNewCode')}
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
              {t('resetPasswordPage.rememberPassword')}{' '}
              <Link to={AUTH_ROUTES.LOGIN} className="text-blue hover:underline">
                {t('login')}
              </Link>
            </p>
          </AuthFormWrapper>
        ) : (
          <div className="flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-3">
              <h3>{t('resetPasswordPage.alertResetSuccess')}</h3>
              <p className="text-base text-text-hi dark:text-text-hi-dark">{t('resetPasswordPage.alertResetMessage')}</p>
            </div>
            <div>
              <Button className="px-8 uppercase" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                {t('login')}
              </Button>
            </div>
          </div>
        )}

        <div className="absolute bottom-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">© {businessName}</div>
      </div>
    </>
  );
};
