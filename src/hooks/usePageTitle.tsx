import { useAuth } from './useAuth';

interface UsePageTitleOptions {
  pageName: string;
  tabName?: string;
  plan?: string;
  orderId?: string;
}

/**
 * Hook to set page title using React 19 native document metadata hoisting.
 * - When authenticated: "User: {username} - Site: {domain} - Page: {pageName}"
 * - When not authenticated: "Site: {domain} - Page: {pageName}"
 */
export const usePageTitle = ({ pageName, tabName, plan, orderId }: UsePageTitleOptions) => {
  const { isAuthenticated, userProfile } = useAuth();
  const domain = window.location.hostname;

  let title: string;
  if (isAuthenticated && userProfile) {
    const username = userProfile.username || 'User';
    title = `User: ${username} - Site: ${domain} - Page: ${pageName}`;
    if (tabName) {
      title += ` - Tab: ${tabName}`;
    }
    if (plan) {
      title += ` - Plan: ${plan}`;
    }
    if (orderId) {
      title += ` - Order ID: ${orderId}`;
    }
  } else {
    title = `Site: ${domain} - Page: ${pageName}`;
  }

  // React 19 automatically hoists <title> to document head
  return <title>{title}</title>;
};
