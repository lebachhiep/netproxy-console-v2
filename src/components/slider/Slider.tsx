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
      labelValues,
      showCurrentValue = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const labelsRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    // Tick offsets as fractions of the full track width (0-1)
    const [tickOffset, setTickOffset] = React.useState({ left: 0, right: 0 });

    const currentValue = value !== undefined ? value : internalValue;

    const { defaultLabels, defaultLabelValues } = React.useMemo(() => {
      if (labels && labelValues) {
        return { defaultLabels: labels, defaultLabelValues: labelValues };
      }

      if (labels) {
        const labelCount = labels.length;
        const generatedLabelValues = Array.from({ length: labelCount }, (_, i) => {
          return min + ((max - min) / (labelCount - 1)) * i;
        });
        return { defaultLabels: labels, defaultLabelValues: generatedLabelValues };
      }

      const labelCount = 6;
      const generatedLabelValues = Array.from({ length: labelCount }, (_, i) => {
        return min + ((max - min) / (labelCount - 1)) * i;
      });
      const generatedLabels = generatedLabelValues.map((val) => formatValue(val));

      return { defaultLabels: generatedLabels, defaultLabelValues: generatedLabelValues };
    }, [min, max, labels, labelValues, formatValue]);

    // Measure label tick positions relative to the track
    React.useLayoutEffect(() => {
      if (!labelsRef.current || !sliderRef.current || !showLabels) return;

      const trackRect = sliderRef.current.getBoundingClientRect();
      const ticks = labelsRef.current.querySelectorAll<HTMLElement>('[data-slider-tick]');
      if (ticks.length < 2) return;

      const firstTickCenter = ticks[0].getBoundingClientRect().left + ticks[0].getBoundingClientRect().width / 2;
      const lastTickCenter =
        ticks[ticks.length - 1].getBoundingClientRect().left + ticks[ticks.length - 1].getBoundingClientRect().width / 2;

      const left = (firstTickCenter - trackRect.left) / trackRect.width;
      const right = (trackRect.right - lastTickCenter) / trackRect.width;

      setTickOffset({ left, right });
    }, [defaultLabels, showLabels]);

    // Convert a value to a track percentage (0-100), where min→leftTick%, max→rightTick%
    const valueToPercentage = React.useCallback(
      (val: number) => {
        const usableRange = 1 - tickOffset.left - tickOffset.right;
        if (usableRange <= 0) return ((val - min) / (max - min)) * 100;
        return (tickOffset.left + ((val - min) / (max - min)) * usableRange) * 100;
      },
      [min, max, tickOffset]
    );

    // Convert a track fraction (0-1) to a value
    const fractionToValue = React.useCallback(
      (fraction: number) => {
        const usableRange = 1 - tickOffset.left - tickOffset.right;
        if (usableRange <= 0) return min + fraction * (max - min);
        return min + ((fraction - tickOffset.left) / usableRange) * (max - min);
      },
      [min, max, tickOffset]
    );

    const updateValue = React.useCallback(
      (clientX: number) => {
        if (!sliderRef.current || disabled) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = fractionToValue(fraction);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        if (value === undefined) {
          setInternalValue(clampedValue);
        }
        onValueChange?.(clampedValue);
      },
      [max, step, disabled, value, onValueChange, fractionToValue]
    );

    // --- Mouse handlers ---
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
        if (isDragging) updateValue(e.clientX);
      },
      [isDragging, updateValue]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    // --- Touch handlers (mobile) ---
    const handleTouchStart = React.useCallback(
      (e: React.TouchEvent) => {
        if (disabled) return;
        setIsDragging(true);
        updateValue(e.touches[0].clientX);
      },
      [disabled, updateValue]
    );

    const handleTouchMove = React.useCallback(
      (e: TouchEvent) => {
        if (isDragging) updateValue(e.touches[0].clientX);
      },
      [isDragging, updateValue]
    );

    const handleTouchEnd = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    // --- Register global listeners when dragging ---
    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const percentage = Math.max(0, Math.min(100, valueToPercentage(currentValue)));

    return (
      <div ref={ref} className={clsx('w-full select-none', className)} {...props}>
        {showCurrentValue && (
          <div className="mb-4">
            <div className="text-2xl font-bold text-blue">{formatValue(currentValue)}</div>
          </div>
        )}

        {/* Slider Track — full width, thumb aligned to milestone ticks */}
        <div
          ref={sliderRef}
          className={clsx(
            'relative h-3 w-full cursor-pointer rounded-full bg-bg-mute dark:bg-bg-mute-dark',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
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
          <div ref={labelsRef} className="relative flex justify-between text-sm">
            {defaultLabels.map((label, index) => {
              const labelValue = defaultLabelValues[index];
              const isActive = Math.abs(currentValue - labelValue) <= step / 2;

              const handleLabelClick = () => {
                if (disabled) return;
                if (value === undefined) setInternalValue(labelValue);
                onValueChange?.(labelValue);
              };

              return (
                <div key={index} className="relative flex flex-col items-center">
                  <div data-slider-tick className="w-[2px] bg-gray-300 h-3" />
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
