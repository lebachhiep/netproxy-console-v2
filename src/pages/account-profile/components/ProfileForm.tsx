import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { UserProfile } from '@/services/user/user.types';
import { itemVariants } from '@/utils/animation';
import { motion } from 'framer-motion';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface ProfileFormProps {
  control: Control<UserProfile>;
  errors: FieldErrors<UserProfile>;
  isSubmitting: boolean;
}

export default function ProfileForm({ control, errors, isSubmitting }: ProfileFormProps) {
  return (
    <>
      {/* Form inputs */}
      <motion.div variants={itemVariants}  className="space-y-4">
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
                placeholder="Họ tên"
                label="Họ tên"
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
              <InputField
                wrapperClassName="h-10"
                {...field}
                type="email"
                placeholder="Email"
                label="Email"
                disabled={true}
              />
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
                placeholder="Tên đăng nhập"
                label="Tên đăng nhập"
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
                placeholder="Số điện thoại"
                label="Số điện thoại"
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
                placeholder="URL ảnh đại diện"
                label="Avatar URL"
                disabled={isSubmitting}
              />
              {errors.avatar_url && <span className="text-red text-sm mt-1">{errors.avatar_url.message}</span>}
            </div>
          )}
        />

        {/* Save button */}
        <Button type="submit" disabled={isSubmitting} className="h-10 px-4">
          {isSubmitting ? 'Đang lưu...' : 'LƯU THÔNG TIN'}
        </Button>
      </motion.div>
    </>
  );
}
