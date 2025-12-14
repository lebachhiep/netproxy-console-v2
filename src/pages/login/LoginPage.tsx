import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { Checkbox } from '@/components/checkbox/Checkbox';
import { EmojiLaugh, LockClosed } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/services/auth/auth.schemas';
import { useAuth } from '@/hooks/useAuth';
import { mapApiError } from '@/utils/errors';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { AuthShowcase } from './components/AuthShowCase';
import bgAuth from '/images/bg_auth.png';
import group7 from '@/assets/images/group-7.png';
import img9 from '@/assets/images/image-9.png';
import productCardImg from '@/assets/images/product-card.png';
import pcImg from '@/assets/images/pc.png';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
interface LocationState {
  from?: string;
}

export const LoginPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: 'Đăng nhập' });
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const { login, isAuthenticated, clearError } = useAuth();
  const { t } = useTranslation();
  const rememberMeTick = (): boolean => {
    try {
      const ticked = localStorage.getItem('RememberMeTicked');
      if (!ticked || (ticked && ticked === 'true')) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error retrieving RememberMeTicked from localStorage:', error);
      return false;
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      login: '',
      password: '',
      remember: rememberMeTick()
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
      await login(data.login, data.password, data.remember || false);
      toast.success(t('auth.LOGIN_SUCCESS'));
      const from = locationState?.from || PROTECTED_ROUTES.HOME;
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = mapApiError(error);
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    }
  };
  return (
    <>
      {pageTitle}
      <AuthLayout
        left={
          <AuthFormWrapper title={t('signIn')} subtitle={t('loginPage.welcome')}>
            <div className="flex flex-col gap-5 p-5 md:p-0 shadow-lg md:shadow-none rounded-[20px] border md:border-none border-border-element dark:border-border-element-dark">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Controller
                      name="login"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputField
                            {...field}
                            type="text"
                            placeholder={t('loginPage.emailOrUserName')}
                            icon={<EmojiLaugh className="text-primary" />}
                            disabled={isSubmitting}
                          />
                          {errors.login && <span className="text-red text-sm mt-1">{errors.login.message}</span>}
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
                            placeholder={t('loginPage.password')}
                            icon={<LockClosed className="text-blue" />}
                            showPasswordToggle
                            disabled={isSubmitting}
                          />
                          {errors.password && <span className="text-red text-sm mt-1">{errors.password.message}</span>}
                        </div>
                      )}
                    />

                    <Link to={AUTH_ROUTES.FORGOT_PASSWORD} className="text-blue text-sm text-underline text-end font-medium">
                      {t('loginPage.forgot')}
                    </Link>
                  </div>

                  <Controller
                    name="remember"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <label className="flex items-center gap-2 w-fit">
                        <Checkbox checked={value} onChange={onChange} disabled={isSubmitting} />
                        <span className="font-normal text-sm text-text-hi dark:text-text-hi-dark">{t('loginPage.remember')}</span>
                      </label>
                    )}
                  />

                  {errors.root && <div className="text-red text-sm text-center">{errors.root.message}</div>}

                  <div className="flex flex-col gap-5">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full dark:pseudo-border-top-orange dark:border-transparent"
                    >
                      {isSubmitting ? t('loginPage.signingIn') : t('signIn').toUpperCase()}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            <p className="text-text-hi dark:text-text-hi-dark text-center text-sm">
              {t('loginPage.dontHaveAnAccount')}{' '}
              <Link to={AUTH_ROUTES.REGISTER} className="text-blue text-underline">
                {t('signup')}
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
                    'aspect-[91/60] md:w-[360px] lg:w-[606px] lg:h-[405px] md:top-[183px] lg:top-[100px] lg:left-[37px] absolute object-contain border border-[8px] border-[#FDCFA8] rounded-3xl  object-fill'
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
              title={t('loginPage.highSpeedProxy')}
              description={
                <>
                  {t('loginPage.secureSolutionThatEnhanceProtection')}
                  <br />
                  {t('loginPage.andOptimizeConnectionPerformance')}
                </>
              }
            />
          </div>
        }
      />
    </>
  );
};
