import { ReactComponent as Logo } from '@/assets/images/logo-text.svg';
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
      <Logo />
    </div>
  );
};
