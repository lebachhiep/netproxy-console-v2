import { twMerge } from 'tailwind-merge';
import { LoaderProps } from './types';
import clsx from 'clsx';

/**
 * Loader component
 * @param isLoading - whether to show the loading overlay
 * @param children - content to render under the overlay
 */
export const Loader = ({ isLoading, children, className, id }: LoaderProps) => {
  // No children: just show centered spinner if loading, else nothing
  if (!children) {
    return isLoading ? (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark"></div>
      </div>
    ) : null;
  }

  // With children: show overlay spinner above children if loading
  return (
    <div className={twMerge(clsx('relative rounded-xl', className))} id={id}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-[102] flex justify-center items-center bg-bg-secondary dark:bg-bg-secondary-dark opacity-60 ">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark"></div>
        </div>
      )}
    </div>
  );
};
