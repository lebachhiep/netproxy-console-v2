import { Button } from '@/components/button/Button';
import { CountrySelect } from '@/components/country-select/CountrySelect';
import { InputField } from '@/components/input/InputField';
import { Select } from '@/components/select/Select';
import CountrySelector from '@/pages/purchase/components/table/CountrySelector';
import { UserProfile } from '@/services/user/user.types';
import { COUNTRY_OPTIONS } from '@/utils/constants';
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
      <div className="space-y-4">
        {/* Họ tên */}
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <div>
              <InputField wrapperClassName="h-10" {...field} type="text" placeholder="Họ tên" label="Họ tên" disabled={isSubmitting} />
              {errors.full_name && <span className="text-red text-sm mt-1">{errors.full_name.message}</span>}
            </div>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <InputField wrapperClassName="h-10" {...field} type="email" placeholder="Email" label="Email" disabled={isSubmitting} />
              {errors.email && <span className="text-red text-sm mt-1">{errors.email.message}</span>}
            </div>
          )}
        />

        {/* Địa chỉ + Quốc gia + Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div>
                <InputField wrapperClassName="h-10" {...field} type="text" placeholder="Địa chỉ" label="Địa chỉ" disabled={isSubmitting} />
                {errors.address && <span className="text-red text-sm mt-1">{errors.address.message}</span>}
              </div>
            )}
          />

          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div>
                <CountrySelect options={COUNTRY_OPTIONS} placeholder="Quốc gia" label="Quốc gia" />
                {errors.country && <span className="text-red text-sm mt-1">{errors.country.message}</span>}
              </div>
            )}
          />

          <Controller
            name="zip"
            control={control}
            render={({ field }) => (
              <div>
                <InputField wrapperClassName="h-10" {...field} type="text" placeholder="Mã Zip" label="Mã Zip" disabled={isSubmitting} />
                {errors.zip && <span className="text-red text-sm mt-1">{errors.zip.message}</span>}
              </div>
            )}
          />
        </div>

        {/* Công ty + VAT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <div>
                <InputField wrapperClassName="h-10" {...field} type="text" placeholder="Công ty" label="Công ty" disabled={isSubmitting} />
                {errors.company && <span className="text-red text-sm mt-1">{errors.company.message}</span>}
              </div>
            )}
          />

          <Controller
            name="vatId"
            control={control}
            render={({ field }) => (
              <div>
                <InputField wrapperClassName="h-10" {...field} type="text" placeholder="VAT ID" label="VAT ID" disabled={isSubmitting} />
                {errors.vatId && <span className="text-red text-sm mt-1">{errors.vatId.message}</span>}
              </div>
            )}
          />
        </div>

        {/* Save button */}
        <Button type="submit" disabled={isSubmitting} className="h-10 px-4">
          {isSubmitting ? 'Đang lưu...' : 'LƯU THÔNG TIN'}
        </Button>
      </div>
    </>
  );
}
