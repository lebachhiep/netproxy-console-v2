import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NavigationRoute, navigationSections } from '@/config/navigation';
import { ResponsiveLayout } from '@/layouts/ResponsiveLayout';
import { NotFoundPage } from '@/pages/404/NotFoundPage';
import { AccountProfilePage } from '@/pages/account-profile/AccountProfilePage';
import ComponentPage from '@/pages/component/ComponentPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import { ForgotPasswordPage } from '@/pages/forgot-password/ForgotPasswordPage';
import HistoryPage from '@/pages/history/HistoryPage';
import { LoginPage } from '@/pages/login/LoginPage';
import OrderDetailPage from '@/pages/order/OrderDetailPage';
import PurchasePage from '@/pages/purchase/PurchasePage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { ResellerPage } from '@/pages/reseller/ResellerPage';
import { ResetPasswordPage } from '@/pages/reset-password/ResetPasswordPage';
import SupportSoftwarePage from '@/pages/support-software/SupportSoftwarePage';
import WalletPage from '@/pages/wallet/WalletPage';
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// const NotFoundPage = lazy(() => import('@/pages/404/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
// const ComponentPage = lazy(() => import('@/pages/component/ComponentPage'));
// const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
// const LoginPage = lazy(() => import('@/pages/login/LoginPage').then((m) => ({ default: m.LoginPage })));
// const RegisterPage = lazy(() => import('@/pages/register/RegisterPage').then((m) => ({ default: m.RegisterPage })));
// const ForgotPasswordPage = lazy(() =>
//   import('@/pages/forgot-password/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
// );
// const PurchasePage = lazy(() => import('@/pages/purchase/PurchasePage'));
// const WalletPage = lazy(() => import('@/pages/wallet/WalletPage'));
// const SupportSoftwarePage = lazy(() => import('@/pages/support-software/SupportSoftwarePage'));

// Extend NavigationRoute với RouteObject properties
export interface Route extends NavigationRoute, RouteObject {
  children?: Route[];
}

// Map navigation routes to actual routes with components
const mapRoutesToComponents = (navRoutes: NavigationRoute[]): Route[] => {
  return navRoutes.map((navRoute) => {
    let element: React.ReactElement | null = null;

    // Map paths to components
    switch (navRoute.path) {
      case '/home':
        element = <DashboardPage />;
        break;
      case '/buy':
        element = <PurchasePage />;
        break;
      case '/wallet':
        element = <WalletPage />;
        break;
      case '/history':
        element = <HistoryPage />;
        break;
      case '/account-profile':
        element = <AccountProfilePage />;
        break;
      case '/components':
        element = <ComponentPage />;
        break;
      case '/support-software':
        element = <SupportSoftwarePage />;
        break;
      case '/reseller':
        element = <ResellerPage />;
        break;
      default:
        element = <></>;
    }

    return {
      ...navRoute,
      element
    };
  });
};

// Create admin sections with components
export const adminSections = (t: any) =>
  navigationSections(t).map((section) => ({
    ...section,
    routes: mapRoutesToComponents(section.routes)
  }));

const routes = (t: any): Route[] => {
  return [
    {
      path: '/',
      name: '/',
      element: (
        <ProtectedRoute>
          <ResponsiveLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true, // Route mặc định khi vào /
          element: <Navigate to="/home" replace />
        },
        ...adminSections(t).flatMap((section) => section.routes),
        {
          path: '/order/:id',
          name: '/order/:id',
          element: <OrderDetailPage />
        }
      ]
    },
    {
      name: '/login',
      element: <LoginPage />,
      path: '/login'
    },
    {
      name: '/register',
      element: <RegisterPage />,
      path: '/register'
    },
    {
      name: '/forgot-password',
      element: <ForgotPasswordPage />,
      path: '/forgot-password'
    },
    {
      name: '/reset-password',
      element: <ResetPasswordPage />,
      path: '/reset-password'
    },
    {
      element: <NotFoundPage />,
      name: '*',
      path: '*'
    }
  ];
};

export { routes };
