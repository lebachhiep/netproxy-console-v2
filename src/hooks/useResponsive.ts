import { useMediaQuery } from 'react-responsive';

/**
 *
 * @returns {
 *   isMobile: boolean;
 *   isTablet: boolean;
 *   isDesktop: boolean;
 *   isLargeDesktop: boolean;
 * }
 */
export const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: 599 }); // <600px
  const isTablet = useMediaQuery({ minWidth: 600, maxWidth: 1023 }); // 600–1023px
  const isDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 }); // 1024–1439px
  const isLargeDesktop = useMediaQuery({ minWidth: 1440 }); // ≥1440px
  const isAbsoluteSidebar = useMediaQuery({ minWidth: 1024, maxWidth: 1280 }); // 1024–1280px to absolute sidebar

  return { isMobile, isTablet, isDesktop, isLargeDesktop, isAbsoluteSidebar };
};
