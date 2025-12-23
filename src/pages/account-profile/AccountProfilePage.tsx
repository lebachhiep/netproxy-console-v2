import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { Tabs } from '@/components/tabs/Tabs';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordFormData, resetPasswordSchema, userProfileSchema } from '@/services/auth/auth.schemas';
import { UserProfile, UpdateProfileRequest } from '@/services/user/user.types';
import { userService } from '@/services/user/user.service';
import { mapApiError } from '@/utils/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessModal } from './components/modal/SuccessModal';
import ProfileForm from './components/ProfileForm';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants, pageVariants } from '@/utils/animation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

export const AccountProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle({ pageName: 'Tài khoản' });
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const { user, userProfile, fetchUserProfile } = useAuth();
  const accountTabs = [
    { key: 'info', label: t('GeneralInformation') || 'Thông tin chung' },
    { key: 'change-password', label: t('changePassword') || 'Đổi mật khẩu' }
    // { key: 'api-key', label: 'API Key' }
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
                    name="password"
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
                          label={t('form.confirmNewPassword') || 'Nhập lại mật khẩu mới'}
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

                  <Button type="submit" disabled={isPasswordSubmitting} className="h-10 px-4 capitalize">
                    {isPasswordSubmitting ? t('form.saving') : t('changePassword')}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Tab 3: API Key */}
          {/* <motion.div variants={containerVariants} className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-sm">
              <motion.div variants={itemVariants} className="flex items-center gap-1">
                <span className="font-semibold text-text-hi dark:text-text-hi-dark">API Key</span>
                <div className="bg-blue rounded-[2px] text-white px-1">1 / 5</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-text-me dark:text-text-me-dark mb-4">
                {t('warnAPI')}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-row justify-center items-center gap-5">
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
                        toast.success(t('toast.success.copyAPIEndpoint'));
                      }
                    }
                  ]}
                />
                <Button variant="default" className="w-fit h-10 px-4 rounded-md" icon={<AddCircle />}>
                  {t('createAPIKey')}
                </Button>
              </motion.div>
            </div>
          </motion.div> */}
        </Tabs>
      </motion.div>
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
