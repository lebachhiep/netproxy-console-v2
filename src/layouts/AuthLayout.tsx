import React from 'react';

interface AuthLayoutProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ left, right }) => {
  return (
    <div className="max-w-[1200px] mx-auto relative md:flex min-h-screen ">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center lg:p-10 min-h-screen lg:min-h-0">{left}</div>
      {/* Right */}
      {right && right}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">
        © Netproxy
      </div>
    </div>
  );
};
