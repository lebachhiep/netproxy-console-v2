import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { EmojiLaugh } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/services/auth/auth.schemas';
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

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, isAuthenticated, clearError } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema) as any,
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data.email);
      toast.success(AUTH_MESSAGES.PASSWORD_RESET_SENT);
      setEmailSent(true);
      reset(); // Clear the form
    } catch (error) {
      const errorMessage = mapFirebaseError(error);
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    }
  };

  return (
    <AuthLayout
      left={
        <AuthFormWrapper
          title="Quên Mật Khẩu"
          subtitle="Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
        >
          {!emailSent ? (
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
                </div>

                {errors.root && (
                  <div className="text-red-500 text-sm text-center">
                    {errors.root.message}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'GỬI EMAIL ĐẶT LẠI MẬT KHẨU'}
                  </Button>

                  <Link
                    to={AUTH_ROUTES.LOGIN}
                    className="text-blue text-sm text-center hover:underline"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div className="text-green-600 text-lg font-medium mb-2">
                  Email đã được gửi!
                </div>
                <p className="text-sm text-gray-600">
                  Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Nếu không nhận được email, vui lòng kiểm tra thư mục spam.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  GỬI LẠI EMAIL
                </Button>

                <Link
                  to={AUTH_ROUTES.LOGIN}
                  className="text-blue text-sm text-center hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}

          <p className="text-center text-sm">
            Bạn chưa có tài khoản?{' '}
            <Link to={AUTH_ROUTES.REGISTER} className="text-blue hover:underline">
              Đăng ký
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