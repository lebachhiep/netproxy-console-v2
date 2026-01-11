import { useBranding } from '@/hooks/useBranding';

export interface AppLogoProps {
  width?: number;
  height?: number;
}

export const AppLogo = ({ width = 150, height }: AppLogoProps) => {
  const { logoUrl } = useBranding();

  return (
    <div
      style={{
        display: 'block',
        width,
        height
      }}
      className="text-center animate-pulse"
    >
      {logoUrl && <img src={logoUrl} alt="Logo" className="h-full w-full object-contain dark:invert" />}
    </div>
  );
};
