import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { UserProfile } from '@/services/user/user.types';
import { itemVariants } from '@/utils/animation';
import { motion } from 'framer-motion';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
interface ProfileFormProps {
  control: Control<UserProfile>;
  errors: FieldErrors<UserProfile>;
  isSubmitting: boolean;
}

export default function ProfileForm({ control, errors, isSubmitting }: ProfileFormProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* Form inputs */}
      <motion.div variants={itemVariants} className="space-y-4">
        {/* Họ tên */}
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <div>
              <InputField
                wrapperClassName="h-10"
                {...field}
                value={field.value ?? ''}
                type="text"
                placeholder={t('form.fullname') || 'Họ tên'}
                label={t('form.fullname') || 'Họ tên'}
                disabled={isSubmitting}
              />
              {errors.full_name && <span className="text-red text-sm mt-1">{errors.full_name.message}</span>}
            </div>
          )}
        />

        {/* Email (read-only) */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <InputField wrapperClassName="h-10" {...field} type="email" placeholder="Email" label="Email" disabled={true} />
              {errors.email && <span className="text-red text-sm mt-1">{errors.email.message}</span>}
            </div>
          )}
        />

        {/* Username (read-only) */}
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <div>
              <InputField
                wrapperClassName="h-10"
                {...field}
                type="text"
                placeholder={t('form.loginName') || 'Tên đăng nhập'}
                label={t('form.loginName') || 'Tên đăng nhập'}
                disabled={true}
              />
              {errors.username && <span className="text-red text-sm mt-1">{errors.username.message}</span>}
            </div>
          )}
        />

        {/* Số điện thoại */}
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <div>
              <InputField
                wrapperClassName="h-10"
                {...field}
                value={field.value ?? ''}
                type="tel"
                placeholder={t('form.phone') || 'Số điện thoại'}
                label={t('form.phone') || 'Số điện thoại'}
                disabled={isSubmitting}
              />
              {errors.phone_number && <span className="text-red text-sm mt-1">{errors.phone_number.message}</span>}
            </div>
          )}
        />

        {/* Avatar URL */}
        <Controller
          name="avatar_url"
          control={control}
          render={({ field }) => (
            <div>
              <InputField
                wrapperClassName="h-10"
                {...field}
                value={field.value ?? ''}
                type="url"
                placeholder={t('form.avaUrl') || 'URL Ảnh Đại Diện'}
                label={t('form.avaUrl')}
                disabled={isSubmitting}
              />
              {errors.avatar_url && <span className="text-red text-sm mt-1">{errors.avatar_url.message}</span>}
            </div>
          )}
        />

        {/* Save button */}
        <Button type="submit" disabled={isSubmitting} className="h-10 px-4">
          {isSubmitting ? t('form.saving') || 'Đang lưu...' : t('form.buttonSave') || 'LƯU THÔNG TIN'}
        </Button>
      </motion.div>
    </>
  );
}
