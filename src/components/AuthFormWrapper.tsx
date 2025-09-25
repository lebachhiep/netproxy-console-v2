import React from 'react';

interface AuthFormWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full max-w-[400px] flex flex-col gap-7">
      <div className="flex flex-col gap-1 items-center">
        <h3>{title}</h3>
        {subtitle && (
          <p className="text-gray-500 text-center text-sm">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
};
