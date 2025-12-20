import { ReactNode } from 'react';

export interface LoaderProps {
  children?: ReactNode;
  isLoading?: boolean;
  className?: string;
  id?: string;
}
