import { Suspense } from 'react';
import { AppLoading } from './AppLoading';

interface AppSuspenseProps {
  children: React.ReactNode;
}

export const AppSuspense = ({ children }: AppSuspenseProps) => {
  return <Suspense fallback={<AppLoading />}>{children}</Suspense>;
};
