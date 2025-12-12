import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { ResetPasswordFormData, resetPasswordSchema } from '@/services/auth/auth.schemas';
import { AUTH_ROUTES } from '@/utils/constants';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
export const ResetPasswordPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: 'Đặt lại mật khẩu' });
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async () => {
    try {
      // TODO
      setStep(2);
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
        {step == 1 ? (
          <AuthFormWrapper title={t('resetPasswordPage.resetPassword')} subtitle={t('resetPasswordPage.askingForEnterPassword')}>
            <div className="p-5 shadow-lg rounded-[20px] border border-border-element dark:border-border-element-dark">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField
                            {...field}
                            type="password"
                            placeholder={t('registerPage.pass')}
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

                  <div className="flex flex-col gap-3">
                    <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? t('resetPasswordPage.settingUp') : t('resetPasswordPage.askingForEnterPassword')}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </AuthFormWrapper>
        ) : (
          <div className="flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-3">
              <h3>{t('resetPasswordPage.resetPassword.alertResetSuccess')}</h3>
              <p className="text-base text-text-hi dark:text-text-hi-dark">{t('resetPasswordPage.resetPassword.alertReset-ed')}!</p>
            </div>
            <div>
              <Button className="px-8 uppercase" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                {t('login')}
              </Button>
            </div>
          </div>
        )}

        <div className="absolute bottom-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">© Netproxy</div>
      </div>
    </>
  );
};
