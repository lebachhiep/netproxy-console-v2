import React from 'react';

interface AuthLayoutProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ left, right }) => {
  return (
    <div className="relative md:flex min-h-screen px-6 md:px-[120px] bg-bg-canvas dark:bg-bg-canvas-dark">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center md:p-10 min-h-screen md:min-h-0">{left}</div>
      {/* Right */}
      {right && right}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 text-text-lo dark:text-text-lo-dark font-medium text-sm">
        © Netproxy
      </div>
    </div>
  );
};
