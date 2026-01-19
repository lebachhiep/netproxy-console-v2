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
import { AUTH_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { useBranding } from '@/hooks/useBranding';
import { Select } from '@/components/select/Select';
import { SupportedLanguages } from '@/config/constants';

export const ForgotPasswordPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const pageTitle = usePageTitle({ pageName: t('loginPage.forgot') });
  const navigate = useNavigate();
  const { resetPassword, isAuthenticated, clearError } = useAuth();
  const { businessName } = useBranding();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

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
      toast.success(t('auth.PASSWORD_RESET_SENT'));
      setSubmittedEmail(data.email); // Store email before resetting form
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
          <AuthFormWrapper title={t('forgotPasswordPage.title')} subtitle={t('forgotPasswordPage.subtitle')}>
            <div className="p-5 shadow-lg rounded-[20px] border border-border-element dark:border-border-element-dark">
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
                            placeholder={t('forgotPasswordPage.inputPlaceholder')}
                            disabled={isSubmitting}
                          />
                          {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>
                      )}
                    />
                  </div>

                  {errors.root && <div className="text-red-500 text-sm text-center">{errors.root.message}</div>}

                  <div className="flex flex-col gap-3">
                    <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? t('sending') : t('forgotPasswordPage.confirm')}
                    </Button>

                    <Link to={AUTH_ROUTES.LOGIN} className="text-blue text-sm text-center hover:underline">
                      {t('forgotPasswordPage.login')}
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
              {t('forgotPasswordPage.noAcc')}{' '}
              <Link to={AUTH_ROUTES.REGISTER} className="text-blue hover:underline">
                {t('forgotPasswordPage.register')}
              </Link>
            </p>
          </AuthFormWrapper>
        ) : (
          <div className="flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-3 max-w-[512px]">
              <h3>{t('forgotPasswordPage.sent')}</h3>
              <p className="text-base text-text-hi dark:text-text-hi-dark">
                {t('forgotPasswordPage.alreadySentEmailMessage')}{' '}
                <a href="#" className="text-blue underline font-medium" onClick={() => setEmailSent(false)}>
                  {t('forgotPasswordPage.resendEmail')}
                </a>
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="default"
                  className="px-8 uppercase"
                  onClick={() => navigate(`${AUTH_ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(submittedEmail)}`)}
                >
                  {t('resetPasswordPage.resetPassword')}
                </Button>
                <Button variant="outlined" className="px-8 uppercase" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                  {t('forgotPasswordPage.login')}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-10 text-text-lo dark:text-text-lo-dark font-medium text-sm flex justify-center flex-col">
          <div className="mb-3 w-[130px]">
            <Select
              options={SupportedLanguages.map((l) => ({ label: l.displayName, value: l.code }))}
              value={i18n.language}
              onChange={(val) => {
                i18n.changeLanguage(String(val));
              }}
              placeholder={t('language') || 'Ngôn ngữ'}
              placement="bottom"
              className="w-full h-10 dark:pseudo-border-top dark:border-transparent dark:bg-[#2B405A] font-inter"
            />
          </div>
          <div className="text-center">© {businessName}</div>
        </div>
      </div>
    </>
  );
};
