import { Button } from '@/components/button/Button';
import { AddCircle, Eye, FileCopy } from '@/components/icons';
import { ApiInput } from '@/components/input/ApiInput';
import { InputField } from '@/components/input/InputField';
import { Tabs } from '@/components/tabs/Tabs';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordFormData, resetPasswordSchema, userProfileSchema } from '@/services/auth/auth.schemas';
import { UserProfile } from '@/services/user/user.types';
import { mapFirebaseError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessModal } from './components/modal/SuccessModal';
import ProfileForm from './components/ProfileForm';

interface AccountProfilePageProps {}

export const AccountProfilePage: React.FC<AccountProfilePageProps> = () => {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const { user, logout } = useAuth();
  const accountTabs = [
    { key: 'info', label: 'Thông tin chung' },
    { key: 'change-password', label: 'Đổi mật khẩu' },
    { key: 'api-key', label: 'API Key' }
  ];

  // Form 1: Profile Info
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting }
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      full_name: user?.displayName ?? '',
      email: user?.email ?? '',
      address: '',
      country: '',
      zip: '',
      company: '',
      vatId: ''
    }
  });

  // Form 2: Reset Password
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    setError: setPasswordError
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmitProfile = async (data: UserProfile) => {
    try {
      console.log('Profile data:', data);
      // TODO: call API update profile
    } catch (error) {
      toast.error('Cập nhật hồ sơ thất bại');
    }
  };

  const onSubmitPassword = async (data: ResetPasswordFormData) => {
    try {
      console.log('Password reset data:', data);
      // TODO: call API reset password
      setShowSuccessModal(true); //
    } catch (error) {
      const errorMessage = mapFirebaseError(error);
      toast.error(errorMessage);
      setPasswordError('root', { message: errorMessage });
    }
  };

  return (
    <>
      <div className="h-full bg-bg-canvas dark:bg-bg-canvas-dark pt-5">
        <Tabs tabs={accountTabs} defaultActiveKey="info">
          {/* Tab 1: Thông tin chung */}
          <div>
            <div className="p-5">
              <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
                <ProfileForm control={profileControl} errors={profileErrors} isSubmitting={isProfileSubmitting} />
              </form>
            </div>
          </div>

          {/* Tab 2: Đổi mật khẩu */}
          <div>
            <div className="p-5">
              <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
                <div className="space-y-4">
                  <Controller
                    name="oldPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          label="Nhập mật khẩu cũ"
                          showPasswordToggle
                          disabled={isPasswordSubmitting}
                        />
                        {passwordErrors.oldPassword && <span className="text-red text-sm mt-1">{passwordErrors.oldPassword.message}</span>}
                      </div>
                    )}
                  />
                  <Controller
                    name="password"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          label="Nhập mật khẩu mới"
                          showPasswordToggle
                          disabled={isPasswordSubmitting}
                        />
                        {passwordErrors.password && <span className="text-red text-sm mt-1">{passwordErrors.password.message}</span>}
                      </div>
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          label="Nhập lại mật khẩu mới"
                          showPasswordToggle
                          disabled={isPasswordSubmitting}
                        />
                        {passwordErrors.confirmPassword && (
                          <span className="text-red text-sm mt-1">{passwordErrors.confirmPassword.message}</span>
                        )}
                      </div>
                    )}
                  />

                  <Button type="submit" disabled={isPasswordSubmitting} className="h-10 px-4 ">
                    {isPasswordSubmitting ? 'Đang lưu...' : 'ĐỔI MẬT KHẨU'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Tab 3: API Key */}
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-text-hi dark:text-text-hi-dark">API Key</span>
                <div className="bg-blue rounded-[2px] text-white px-1">1 / 5</div>
              </div>
              <span className="text-text-me dark:text-text-me-dark mb-4">Không chia sẻ mã API cho bất kỳ ai hoặc bên thứ 3 nào</span>

              <ApiInput
                value={
                  'https://api.netproxy.io/api/bandwidthProxy/getProxies?apiKey=823321CD283FFE61B8A0B99433E704A8&country=all&type=all&count=50'
                }
                actions={[
                  {
                    icon: <Eye className="text-primary dark:text-primary-dark w-6 h-6" />,
                    onClick: () => console.log('View clicked')
                  },
                  {
                    icon: <FileCopy className="text-blue dark:text-blue-dark w-6 h-6" />,
                    onClick: () => navigator.clipboard.writeText('https://api.netproxy.io/api/...')
                  }
                ]}
              />
            </div>
            <Button variant="default" className="mt-2 w-fit h-10 px-4" icon={<AddCircle />}>
              TẠO MÃ API MỚI
            </Button>
          </div>
        </Tabs>
      </div>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => {
          setShowSuccessModal(false);
          //TODO
        }}
      />
    </>
  );
};
