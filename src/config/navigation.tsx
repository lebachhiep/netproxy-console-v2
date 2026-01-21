import React from 'react';
import {
  Apps,
  ArrowCounter,
  CartFilled,
  CartOutlined,
  ChatWarning,
  ChatWarningFilled,
  ClockBillFilled,
  CloudSwapFilled,
  CloudSwapOutlined,
  DashboardFilled,
  DashboardOutlined,
  DocumentSync,
  DocumentSyncFilled,
  Person,
  PersonFilled,
  Open,
  WalletCreditCardFilled,
  WalletCreditCardOutlined,
  ClockBill
} from '@/components/icons';

export interface NavigationRoute {
  title?: any;
  icon?: React.ReactNode;
  collapsedIcon?: React.ReactNode;
  iconClass?: string;
  breadcrumbIcon?: React.ReactNode;
  breadcrumb?: string;
  hidden?: boolean;
  name?: string;
  path?: string;
  aliasPath?: string;
  externalUrl?: string;
}

export interface NavigationSection {
  title: string;
  routes: NavigationRoute[];
}

export const navigationSections = (t: (key: string) => string): NavigationSection[] => {
  return [
    {
      title: 'CHÍNH',
      routes: [
        {
          title: t('home'),
          icon: <DashboardFilled />,
          collapsedIcon: <DashboardOutlined />,
          iconClass: 'text-primary',
          breadcrumbIcon: <DashboardFilled width={32} height={32} className="text-primary" />,
          path: '/home',
          name: '/home',
          breadcrumb: t('home')
        },
        {
          title: t('proxyDetails'),
          hidden: true, // ẩn trong menu
          path: '/proxy/detail/:id',
          name: '/proxy/detail/:id',
          breadcrumb: t('proxyDetails'),
          breadcrumbIcon: <CartFilled width={32} height={32} className="text-yellow" />
        },
        {
          title: t('buy'),
          icon: <CartFilled />,
          collapsedIcon: <CartOutlined />,
          iconClass: 'text-yellow',
          breadcrumbIcon: <CartFilled width={32} height={32} className="text-yellow" />,
          path: '/buy',
          name: '/buy',
          breadcrumb: t('buy')
        },
        {
          title: t('checkWallet'),
          icon: <WalletCreditCardFilled />,
          collapsedIcon: <WalletCreditCardOutlined />,
          iconClass: 'text-green',
          breadcrumbIcon: <WalletCreditCardFilled width={32} height={32} className="text-green" />,
          path: '/wallet',
          name: '/wallet',
          breadcrumb: t('checkWallet')
        },
        {
          title: t('orderHistory'),
          icon: <ClockBillFilled />,
          collapsedIcon: <ClockBill />,
          iconClass: 'text-blue',
          breadcrumbIcon: <ClockBillFilled width={32} height={32} className="text-blue" />,
          path: '/history',
          name: '/history',
          breadcrumb: t('orderHistory')
        },
        {
          title: t('account'),
          icon: <Person />,
          collapsedIcon: <Person />,
          iconClass: 'text-blue',
          breadcrumbIcon: <PersonFilled width={32} height={32} className="text-blue" />,
          path: '/account-profile',
          name: '/account-profile',
          breadcrumb: t('account'),
          hidden: true
        },
        {
          title: t('components'),
          icon: <Apps />,
          iconClass: 'text-blue',
          breadcrumbIcon: <DashboardFilled width={32} height={32} className="text-primary" />,
          path: '/components',
          name: '/components',
          breadcrumb: t('components'),
          hidden: true
        },
        {
          title: t('order.name'),
          icon: <ArrowCounter />,
          iconClass: 'text-blue',
          breadcrumbIcon: <DashboardFilled width={32} height={32} className="text-primary" />,
          path: '/order',
          name: '/order',
          breadcrumb: t('order.name'),
          hidden: true
        }
      ]
    },
    {
      title: 'KHÁC',
      routes: [
        {
          title: (
            <div className="flex items-center flex-1 justify-between w-full">
              <span>{t('resellerProgram')}</span>
              <Open className="text-blue dark:text-blue-dark" />
            </div>
          ),
          icon: <CloudSwapFilled />,
          collapsedIcon: <CloudSwapOutlined />,
          iconClass: 'text-pink',
          breadcrumbIcon: <CloudSwapFilled width={32} height={32} className="text-pink" />,
          externalUrl: 'https://seller.prx.network',
          name: '/reseller',
          breadcrumb: t('resellerProgram')
        },
        {
          title: (
            <div className="flex items-center flex-1 justify-between w-full">
              <span>{t('apiDocumentation')}</span>
              <Open className="text-blue dark:text-blue-dark" />
            </div>
          ),
          icon: <DocumentSyncFilled />,
          collapsedIcon: <DocumentSync />,
          iconClass: 'text-primary',
          breadcrumbIcon: <DocumentSyncFilled width={32} height={32} className="text-primary" />,
          externalUrl: 'https://www.postman.com/prx111/prx-network/documentation/40157332-a90bf316-d932-4f36-8dc0-c6278a47f486',
          name: '/api-docs',
          breadcrumb: t('apiDocumentation')
        }
      ]
    },
    {
      title: 'FOOTER',
      routes: [
        {
          title: t('help'),
          icon: <ChatWarningFilled />,
          collapsedIcon: <ChatWarning />,
          iconClass: 'text-blue',
          breadcrumbIcon: <ChatWarningFilled width={32} height={32} className="text-blue" />,
          path: '/help',
          name: '/help',
          breadcrumb: t('help')
        },
        {
          title: (
            <div className="flex items-center justify-between">
              <span>{t('supportedSoftware')}</span>
              {/* <div className="text-xs w-6 flex items-center justify-center h-6 rounded-full font-medium bg-blue-bg dark:bg-blue-bg-dark text-blue dark:text-blue-dark">
              4
            </div> */}
            </div>
          ),
          icon: <Apps />,
          iconClass: 'text-yellow',
          breadcrumbIcon: <Apps width={32} height={32} className="text-yellow" />,
          path: '/support-software',
          name: '/support-software',
          breadcrumb: t('supportedSoftware')
        }
      ]
    }
  ];
};
