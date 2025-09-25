import { AppLogo } from './AppLogo';

export const AppLoading = () => {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <AppLogo />
    </div>
  );
};
