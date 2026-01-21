import { Button } from '@/components/button/Button';
import { ApiInput } from '@/components/input/ApiInput';
import { InputField } from '@/components/input/InputField';
import { Tabs } from '@/components/tabs/Tabs';
import { Eye, EyeOff, FileCopy, AddCircle } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { ChangePasswordFormData, changePasswordSchema, userProfileSchema } from '@/services/auth/auth.schemas';
import { UserProfile, UpdateProfileRequest } from '@/services/user/user.types';
import { userService } from '@/services/user/user.service';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessModal } from './components/modal/SuccessModal';
import { ApiKeyConfirmModal } from './components/modal/ApiKeyConfirmModal';
import ProfileForm from './components/ProfileForm';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, pageVariants } from '@/utils/animation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

export const AccountProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle({ pageName: t('accountProfile') || 'Tài khoản' });
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const { user, userProfile, fetchUserProfile, logout } = useAuth();

  // API Key state
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [isHideApiKey, setIsHideApiKey] = useState(true);
  const [showApiKeyConfirmModal, setShowApiKeyConfirmModal] = useState(false);
  const [isRotatingApiKey, setIsRotatingApiKey] = useState(false);

  const accountTabs = [
    { key: 'info', label: t('GeneralInformation') || 'Thông tin chung' },
    { key: 'change-password', label: t('changePassword') || 'Đổi mật khẩu' },
    { key: 'api-key', label: 'API Key' }
  ];

  // Form 1: Profile Info
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
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
      ban_reason: userProfile?.ban_reason ?? null,
      total_purchased: userProfile?.total_purchased ?? 0
    }
  });

  // Form 2: Change Password
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    setError: setPasswordError,
    reset: resetPasswordForm
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  // Sync form with userProfile from zustand when it loads
  useEffect(() => {
    if (userProfile) {
      resetProfileForm({
        id: userProfile.id,
        email: userProfile.email,
        username: userProfile.username,
        full_name: userProfile.full_name ?? null,
        phone_number: userProfile.phone_number ?? null,
        role: userProfile.role,
        avatar_url: userProfile.avatar_url ?? null,
        balance: userProfile.balance ?? 0,
        is_banned: userProfile.is_banned ?? false,
        ban_reason: userProfile.ban_reason ?? null,
        total_purchased: userProfile.total_purchased ?? 0
      });
    }
  }, [userProfile, resetProfileForm]);

  const onSubmitProfile = async (data: UserProfile) => {
    try {
      // Extract only updatable fields
      const updateData: UpdateProfileRequest = {
        full_name: data.full_name || null,
        phone_number: data.phone_number || null,
        avatar_url: data.avatar_url || null
      };

      // Call API to update profile
      await userService.updateProfile(updateData);

      // Refresh user profile from server to get latest data
      await fetchUserProfile();

      // Show success message
      toast.success(t('toast.success.profileUpdated'));
    } catch (error) {
      const errorMessage = mapApiError(error);
      toast.error('toast.error.profileUpdated' + errorMessage || 'Cập nhật hồ sơ thất bại');
    }
  };

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    try {
      await userService.changePassword(data.currentPassword, data.newPassword);
      resetPasswordForm();
      setShowSuccessModal(true);
    } catch (error) {
      const errorMessage = mapApiError(error);
      toast.error(t('toast.error.passwordChange') || errorMessage);
      setPasswordError('root', { message: errorMessage });
    }
  };

  const handleRotateApiKey = async () => {
    setIsRotatingApiKey(true);
    try {
      const response = await userService.rotateApiKey();
      setGeneratedApiKey(response.api_key);
      setIsHideApiKey(false); // Show the key immediately after generation
      setShowApiKeyConfirmModal(false);
      toast.success(t('toast.success.apiKeyGenerated') || 'API Key đã được tạo thành công');
    } catch (error) {
      const errorMessage = mapApiError(error);
      toast.error(errorMessage);
    } finally {
      setIsRotatingApiKey(false);
    }
  };

  const handleCopyApiKey = () => {
    if (generatedApiKey) {
      navigator.clipboard.writeText(generatedApiKey);
      toast.success(t('toast.success.copyAPIKey') || 'Đã sao chép API Key');
    }
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="h-full flex flex-col overflow-auto bg-bg-canvas dark:bg-bg-canvas-dark pt-5"
      >
        {pageTitle}
        <Tabs tabs={accountTabs} defaultActiveKey="info">
          {/* Tab 1: Thông tin chung */}
          <motion.div variants={containerVariants}>
            <motion.div variants={itemVariants} className="p-5">
              <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
                <ProfileForm control={profileControl} errors={profileErrors} isSubmitting={isProfileSubmitting} />
              </form>
            </motion.div>
          </motion.div>

          {/* Tab 2: Đổi mật khẩu */}
          <motion.div variants={containerVariants}>
            <div className="p-5">
              <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
                <motion.div variants={itemVariants} className="space-y-4">
                  <Controller
                    name="currentPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          inputClassName="w-full"
                          label={t('form.currentPassword') || 'Mật khẩu hiện tại'}
                          showPasswordToggle
                          disabled={isPasswordSubmitting}
                        />
                        {passwordErrors.currentPassword && (
                          <span className="text-red text-sm mt-1">{passwordErrors.currentPassword.message}</span>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="newPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          inputClassName="w-full"
                          label={t('form.newPassword') || 'Mật khẩu mới'}
                          showPasswordToggle
                          disabled={isPasswordSubmitting}
                        />
                        {passwordErrors.newPassword && <span className="text-red text-sm mt-1">{passwordErrors.newPassword.message}</span>}
                      </div>
                    )}
                  />

                  <Controller
                    name="confirmNewPassword"
                    control={passwordControl}
                    render={({ field }) => (
                      <div>
                        <InputField
                          wrapperClassName="h-10"
                          {...field}
                          type="password"
                          label={t('form.confirmNewPassword') || 'Nhập lại mật khẩu mới'}
                          showPasswordToggle
                          disabled={isPasswordSubmitting}
                          inputClassName="w-full"
                        />
                        {passwordErrors.confirmNewPassword && (
                          <span className="text-red text-sm mt-1">{passwordErrors.confirmNewPassword.message}</span>
                        )}
                      </div>
                    )}
                  />

                  <Button type="submit" disabled={isPasswordSubmitting} className="h-10 px-4 capitalize">
                    {isPasswordSubmitting ? t('form.saving') : t('changePassword')}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Tab 3: API Key */}
          <motion.div variants={containerVariants} className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-sm">
              <motion.div variants={itemVariants} className="flex items-center gap-1">
                <span className="font-semibold text-text-hi dark:text-text-hi-dark">API Key</span>
              </motion.div>
              <motion.div variants={itemVariants} className="text-text-me dark:text-text-me-dark mb-4">
                {t('apiKey.warning') || 'API Key được sử dụng để xác thực các yêu cầu API. Hãy giữ bí mật API Key của bạn.'}
              </motion.div>

              {generatedApiKey && (
                <>
                  <motion.div variants={itemVariants} className="flex flex-row items-center gap-3">
                    <ApiInput
                      label=""
                      className="flex-1"
                      value={isHideApiKey ? '*'.repeat(generatedApiKey.length) : generatedApiKey}
                      actions={[
                        {
                          icon: isHideApiKey ? (
                            <Eye className="text-primary dark:text-primary-dark w-5 h-5" />
                          ) : (
                            <EyeOff className="text-primary dark:text-primary-dark w-5 h-5" />
                          ),
                          onClick: () => setIsHideApiKey(!isHideApiKey)
                        },
                        {
                          icon: <FileCopy className="text-blue dark:text-blue-dark w-5 h-5" />,
                          onClick: handleCopyApiKey
                        }
                      ]}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="text-yellow-hi dark:text-yellow-hi-dark text-sm mt-2">
                    {t('apiKey.saveNow') || 'Hãy lưu API Key này ngay bây giờ. Bạn sẽ không thể xem lại key này sau khi rời khỏi trang.'}
                  </motion.div>
                </>
              )}

              <motion.div variants={itemVariants} className="mt-4">
                <Button
                  variant="default"
                  className="w-fit h-10 px-4 rounded-md"
                  icon={<AddCircle />}
                  onClick={() => setShowApiKeyConfirmModal(true)}
                >
                  {generatedApiKey ? t('apiKey.rotate') || 'Tạo API Key mới' : t('apiKey.generate') || 'Tạo API Key'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Tabs>
      </motion.div>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => {
          setShowSuccessModal(false);
          logout();
        }}
      />
      <ApiKeyConfirmModal
        open={showApiKeyConfirmModal}
        onClose={() => setShowApiKeyConfirmModal(false)}
        onConfirm={handleRotateApiKey}
        isLoading={isRotatingApiKey}
      />
    </>
  );
};
