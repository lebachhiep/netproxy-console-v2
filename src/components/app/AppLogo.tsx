import { LOGO_URL } from '@/config/api';

export interface AppLogoProps {
  width?: number;
  height?: number;
}

export const AppLogo = ({ width = 150, height }: AppLogoProps) => {
  return (
    <div
      style={{
        display: 'block',
        width,
        height
      }}
      className="text-center animate-pulse"
    >
      <img src={LOGO_URL} alt="Logo" className="h-full w-full object-contain dark:invert" />
    </div>
  );
};
