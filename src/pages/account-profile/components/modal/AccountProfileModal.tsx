import { Button } from '@/components/button/Button';
import { AddCircle, Eye, EyeOff, FileCopy } from '@/components/icons';
import { ApiInput } from '@/components/input/ApiInput';
import { InputField } from '@/components/input/InputField';
import { Modal } from '@/components/modal/Modal';
import { Tabs } from '@/components/tabs/Tabs';
import { ResetPasswordFormData, resetPasswordSchema, userProfileSchema } from '@/services/auth/auth.schemas';
import { UserProfile } from '@/services/user/user.types';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ProfileForm from '../ProfileForm';
import { SuccessModal } from './SuccessModal';
import { useTranslation } from 'react-i18next';
interface AccountProfileModalProps {
  open: boolean;
  user?: UserProfile | null;
  onClose: () => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({ open, user, onClose }) => {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const apiValue = 'https://api.netproxy.io/api/bandwidthProxy/getProxies?apiKey=823321...';
  const [isHideApiValue, setIsHideApiValue] = useState(true);
  const { t } = useTranslation();
  const accountTabs = [
    { key: 'info', label: 'Thông tin chung' },
    { key: 'change-password', label: 'Đổi mật khẩu' }
  ];

  // Form 1: Profile Info
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting }
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      id: user?.id ?? '',
      email: user?.email ?? '',
      username: user?.username ?? '',
      full_name: user?.full_name ?? null,
      phone_number: user?.phone_number ?? null,
      role: user?.role ?? 'user',
      avatar_url: user?.avatar_url ?? null,
      balance: user?.balance ?? 0,
      is_banned: user?.is_banned ?? false,
      ban_reason: user?.ban_reason ?? null,
      total_purchased: user?.total_purchased ?? 0
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
      toast.error('toast.error.profileUpdated');
      console.log('Profile update error:', error);
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
    <Modal
      bodyClassName="h-full"
      className="h-[100dvh] rounded-none max-w-[1085px] relative"
      open={open}
      onClose={onClose}
      title={'Tài khoản'}
    >
      <div className="h-full bg-bg-canvas dark:bg-bg-canvas-dark">
        <Tabs tabs={accountTabs} defaultActiveKey="info">
          {/* Tab 1: Thông tin chung */}
          <div>
            <div className="p-5 border-b-2 border-border-element dark:border-border-element-dark">
              <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
                <ProfileForm control={profileControl} errors={profileErrors} isSubmitting={isProfileSubmitting} />
              </form>
            </div>

            {/* API Key section */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-text-hi dark:text-text-hi-dark">API Key</span>
                  <div className="bg-blue rounded-[2px] text-white px-1">1 / 5</div>
                </div>
                <span className="text-text-me dark:text-text-me-dark">Không chia sẻ mã API cho bất kỳ ai hoặc bên thứ 3 nào</span>

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
                        toast.success(t('toast.success.copyAPIEndPoint'));
                      }
                    }
                  ]}
                />
              </div>
              <Button variant="default" className="mt-2 w-fit h-10 px-4" icon={<AddCircle />}>
                TẠO MÃ API MỚI
              </Button>
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
    </Modal>
  );
};
