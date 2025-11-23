import { RadioGroup } from '@/components/radio/RadioGroup';
import { useState } from 'react';

export const DurationRadioGroup = ({ durationOptions }: { durationOptions: number[] }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(durationOptions[0]);

  const handleDurationChange = (value: string | number) => {
    setSelectedDuration(Number(value));
  };
  return (
    <div className="flex flex-row gap-2">
      <label>Chọn thời hạn: </label>
      <RadioGroup
        value={selectedDuration}
        onChange={handleDurationChange}
        options={durationOptions.map((days) => ({ label: `${days} ngày`, value: days, key: days + '' }))}
      />
    </div>
  );
};
