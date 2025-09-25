import React from 'react';

interface AuthLayoutProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ left, right }) => {
  return (
    <div className="relative flex min-h-screen bg-white px-5 md:px-[120px]">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center p-10">{left}</div>
      {/* Right */}
      {right && right}
      <div className="absolute bottom-10 left-10 text-text-lo font-medium text-sm">© Netproxy</div>
    </div>
  );
};
