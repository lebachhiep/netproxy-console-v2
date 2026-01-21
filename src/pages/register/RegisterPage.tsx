import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData, registerSchema } from '@/services/auth/auth.schemas';
import { AUTH_ROUTES } from '@/utils/constants';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/select/Select';
import { SupportedLanguages } from '@/config/constants';
import { useBranding } from '@/hooks/useBranding';
export const RegisterPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: 'Đăng ký' });
  const navigate = useNavigate();
  const { register, isAuthenticated, clearError } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { t, i18n } = useTranslation();
  const { businessName } = useBranding();

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
      username: '',
      password: '',
      confirmPassword: ''
    }
  });

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
      if (!executeRecaptcha) {
        toast.error(t('recaptchaNotReady'));
        return;
      }

      const captchaToken = await executeRecaptcha('register');

      await register({
        email: data.email,
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        captchaToken
      });
      toast.success(t('auth.REGISTER_SUCCESS'));
      navigate('/', { replace: true });
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
        <AuthFormWrapper title={t('signup')} subtitle={t('registerPage.subtitle')}>
          <div className="p-5 shadow-lg rounded-[20px] border border-border-element dark:border-border-element-dark">
            <div className="flex flex-col gap-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField {...field} type="text" placeholder={t('registerPage.fullname')} disabled={isSubmitting} />
                          {errors.fullName && <span className="text-red text-sm mt-1">{errors.fullName.message}</span>}
                        </div>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField {...field} type="email" placeholder={t('registerPage.email')} disabled={isSubmitting} />
                          {errors.email && <span className="text-red text-sm mt-1">{errors.email.message}</span>}
                        </div>
                      )}
                    />

                    <Controller
                      name="username"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField {...field} type="text" placeholder={t('registerPage.username')} disabled={isSubmitting} />
                          {errors.username && <span className="text-red text-sm mt-1">{errors.username.message}</span>}
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
                            placeholder={t('registerPage.pass')}
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
                            placeholder={t('registerPage.repass')}
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
                      {isSubmitting ? t('registerPage.registering') : t('signup').toUpperCase()}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
            {t('registerPage.haveAcc')}{' '}
            <Link to={AUTH_ROUTES.LOGIN} className="text-blue hover:underline">
              {t('login')}
            </Link>
          </p>
        </AuthFormWrapper>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-lo dark:text-text-lo-dark font-medium text-sm w-full max-w-xs px-4 flex justify-center gap-3 flex-col">
          <div className="bottom-50 text-center w-[130px] mx-auto">
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
          <span className="align-center mx-auto">© {businessName}</span>
        </div>
      </div>
    </>
  );
};
