import { Helmet } from 'react-helmet-async';
import { useAuth } from './useAuth';

interface UsePageTitleOptions {
  pageName: string;
}

/**
 * Hook to set page title:
 * - When authenticated: "User: {username} - Site: {domain} - Page: {pageName}"
 * - When not authenticated: "Site: {domain} - Page: {pageName}"
 */
export const usePageTitle = ({ pageName }: UsePageTitleOptions) => {
  const { isAuthenticated, userProfile } = useAuth();
  const domain = window.location.hostname;

  let title: string;
  if (isAuthenticated && userProfile) {
    const username = userProfile.username || 'User';
    title = `User: ${username} - Site: ${domain} - Page: ${pageName}`;
  } else {
    title = `Site: ${domain} - Page: ${pageName}`;
  }

  return <Helmet><title>{title}</title></Helmet>;
};

