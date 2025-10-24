import { Button } from '@/components/button/Button';
import { AddCircle, Eye, EyeOff, FileCopy } from '@/components/icons';
import { ApiInput } from '@/components/input/ApiInput';
import { InputField } from '@/components/input/InputField';
import { Tabs } from '@/components/tabs/Tabs';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordFormData, resetPasswordSchema, userProfileSchema } from '@/services/auth/auth.schemas';
import { UserProfile } from '@/services/user/user.types';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessModal } from './components/modal/SuccessModal';
import ProfileForm from './components/ProfileForm';

interface AccountProfilePageProps {}

export const AccountProfilePage: React.FC<AccountProfilePageProps> = () => {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [apiValue, setApiValue] = useState('https://api.netproxy.io/api/bandwidthProxy/getProxies?apiKey=823321...');
  const [isHideApiValue, setIsHideApiValue] = useState(true);
  const { user, userProfile, logout } = useAuth();
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
      id: userProfile?.id ?? user?.user_id ?? '',
      email: userProfile?.email ?? user?.email ?? '',
      username: userProfile?.username ?? user?.username ?? '',
      full_name: userProfile?.full_name ?? null,
      phone_number: userProfile?.phone_number ?? null,
      role: userProfile?.role ?? user?.role ?? 'user',
      avatar_url: userProfile?.avatar_url ?? null,
      balance: userProfile?.balance ?? 0,
      is_banned: userProfile?.is_banned ?? false,
      ban_reason: userProfile?.ban_reason ?? null
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
      const errorMessage = mapApiError(error);
      toast.error(errorMessage);
      setPasswordError('root', { message: errorMessage });
    }
  };

  return (
    <>
      <div className="h-full flex flex-col overflow-auto bg-bg-canvas dark:bg-bg-canvas-dark pt-5">
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
                    name="password"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          inputClassName="w-full"
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
                          inputClassName="w-full"
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

              <div className="flex flex-row justify-center items-center gap-5">
                <ApiInput
                  value={isHideApiValue ? '*'.repeat(apiValue.length) : apiValue}
                  actions={[
                    {
                      icon: isHideApiValue ? (
                        <EyeOff className="text-primary dark:text-primary-dark w-6 h-6" />
                      ) : (
                        <Eye className="text-primary dark:text-primary-dark w-6 h-6" />
                      ),
                      onClick: () => setIsHideApiValue(!isHideApiValue)
                    },
                    {
                      icon: <FileCopy className="text-blue dark:text-blue-dark w-6 h-6" />,
                      onClick: () => {
                        navigator.clipboard.writeText(apiValue);
                        toast.success('Đã sao chép API Endpoint');
                      }
                    }
                  ]}
                />
                <Button variant="default" className="w-fit h-10 px-4 rounded-md" icon={<AddCircle />}>
                  TẠO MÃ API MỚI
                </Button>
              </div>
            </div>
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
