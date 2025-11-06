import React from 'react';

/**
 * Skeleton loader for PricingCard
 * Shows animated placeholder while plan data is loading
 */
export const PlanCardSkeleton: React.FC = () => {
  return (
    <div className="relative w-full rounded-xl border-2 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark shadow-xs p-5 flex flex-col gap-1">
      {/* Tag skeleton */}
      <div className="absolute top-0 right-0 translate-x-0 -translate-y-1/2">
        <div className="h-6 w-20 bg-bg-mute dark:bg-bg-mute-dark rounded-full animate-pulse" />
      </div>

      {/* Title skeleton */}
      <div className="h-6 bg-bg-mute dark:bg-bg-mute-dark rounded w-3/4 mb-2 animate-pulse" />

      {/* Price skeleton */}
      <div className="flex items-start gap-1 mb-2">
        <div className="h-4 w-4 bg-bg-mute dark:bg-bg-mute-dark rounded animate-pulse" />
        <div className="h-8 w-24 bg-bg-mute dark:bg-bg-mute-dark rounded animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="h-3 bg-bg-mute dark:bg-bg-mute-dark rounded w-full mb-1 animate-pulse" />
      <div className="h-3 bg-bg-mute dark:bg-bg-mute-dark rounded w-5/6 mb-4 animate-pulse" />

      {/* Divider */}
      <div className="h-[1px] bg-border-element dark:bg-border-element-dark my-3" />

      {/* Features skeleton (4 rows) */}
      <div className="flex flex-col gap-3 mb-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-6 w-6 bg-bg-mute dark:bg-bg-mute-dark rounded animate-pulse flex-shrink-0" />
            <div className="h-4 bg-bg-mute dark:bg-bg-mute-dark rounded flex-1 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-border-element dark:bg-border-element-dark my-3" />

      {/* Button skeleton */}
      <div className="h-12 bg-bg-mute dark:bg-bg-mute-dark rounded-full animate-pulse mt-2" />
    </div>
  );
};
