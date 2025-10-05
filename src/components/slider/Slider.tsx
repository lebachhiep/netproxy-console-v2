'use client';

import clsx from 'clsx';
import * as React from 'react';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  showLabels?: boolean;
  labels?: string[];
  labelValues?: number[];
  showCurrentValue?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = min,
      onValueChange,
      className,
      disabled = false,
      formatValue = (val) => `$${val.toFixed(2)}`,
      showLabels = true,
      labels,
      labelValues, // Giá trị thực của từng label
      showCurrentValue = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const currentValue = value !== undefined ? value : internalValue;

    // Generate default labels and labelValues if not provided
    const { defaultLabels, defaultLabelValues } = React.useMemo(() => {
      if (labels && labelValues) {
        return { defaultLabels: labels, defaultLabelValues: labelValues };
      }

      if (labels) {
        // Nếu có labels nhưng không có labelValues, tạo labelValues dựa trên việc chia đều
        const labelCount = labels.length;
        const generatedLabelValues = Array.from({ length: labelCount }, (_, i) => {
          return min + ((max - min) / (labelCount - 1)) * i;
        });
        return { defaultLabels: labels, defaultLabelValues: generatedLabelValues };
      }

      // Generate default labels và values
      const labelCount = 6;
      const generatedLabelValues = Array.from({ length: labelCount }, (_, i) => {
        return min + ((max - min) / (labelCount - 1)) * i;
      });
      const generatedLabels = generatedLabelValues.map((val) => formatValue(val));

      return { defaultLabels: generatedLabels, defaultLabelValues: generatedLabelValues };
    }, [min, max, labels, labelValues, formatValue]);

    const updateValue = React.useCallback(
      (clientX: number) => {
        if (!sliderRef.current || disabled) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = min + percentage * (max - min);
        const steppedValue = Math.round(newValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        if (value === undefined) {
          setInternalValue(clampedValue);
        }
        onValueChange?.(clampedValue);
      },
      [min, max, step, disabled, value, onValueChange]
    );

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        setIsDragging(true);
        updateValue(e.clientX);
      },
      [disabled, updateValue]
    );

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (isDragging) {
          updateValue(e.clientX);
        }
      },
      [isDragging, updateValue]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>
        {showCurrentValue && (
          <div className="mb-4">
            <div className="text-2xl font-bold text-blue">{formatValue(currentValue)}</div>
          </div>
        )}

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className={clsx(
            'relative h-3 w-full cursor-pointer rounded-full bg-bg-mute dark:bg-bg-mute-dark',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Active Track */}
          <div className="absolute h-full rounded-full bg-blue dark:bg-blue-dark" style={{ width: `${percentage}%` }} />

          {/* Thumb */}
          <div
            ref={thumbRef}
            className={clsx(
              'absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue shadow-stest border-2 border-white cursor-pointer transition-transform',
              isDragging && 'scale-110',
              disabled && 'cursor-not-allowed'
            )}
            style={{ left: `${percentage}%` }}
          />
        </div>

        {/* Labels */}
        {showLabels && (
          <div className="relative flex justify-between text-sm">
            {defaultLabels.map((label, index) => {
              const labelValue = defaultLabelValues[index];

              // Cải thiện logic kiểm tra active
              const isActive = Math.abs(currentValue - labelValue) <= step / 2;

              const handleLabelClick = () => {
                if (disabled) return;
                if (value === undefined) setInternalValue(labelValue);
                onValueChange?.(labelValue);
              };

              return (
                <div key={index} className="relative flex flex-col items-center">
                  {/* Tick line connecting down to track */}
                  <div className="w-[2px] bg-gray-300 h-3" />

                  {/* Clickable label */}
                  <div
                    onClick={handleLabelClick}
                    className={clsx(
                      'cursor-pointer border-2 border-border dark:border-border-dark transition-colors flex items-center h-6 px-3 rounded-[100px] font-bold',
                      isActive
                        ? 'text-blue dark:text-blue-dark bg-blue-bg dark:bg-blue-bg-dark border-transparent'
                        : 'text-text-lo bg-bg-primary dark:bg-bg-primary-dark border-border-element'
                    )}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
