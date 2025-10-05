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
  SettingsFilled,
  WalletCreditCardFilled,
  WalletCreditCardOutlined
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
}

export interface NavigationSection {
  title: string;
  routes: NavigationRoute[];
}

export const navigationSections: NavigationSection[] = [
  {
    title: 'CHÍNH',
    routes: [
      {
        title: 'Trang chủ',
        icon: <DashboardFilled />,
        collapsedIcon: <DashboardOutlined />,
        iconClass: 'text-primary',
        breadcrumbIcon: <DashboardFilled width={32} height={32} className="text-primary" />,
        path: '/home',
        name: '/home',
        breadcrumb: 'Trang chủ'
      },
      {
        title: 'Mua hàng',
        icon: <CartFilled />,
        collapsedIcon: <CartOutlined />,
        iconClass: 'text-yellow',
        breadcrumbIcon: <CartFilled width={32} height={32} className="text-yellow" />,
        path: '/buy',
        name: '/buy',
        breadcrumb: 'Mua hàng'
      },
      {
        title: 'Xem ví',
        icon: <WalletCreditCardFilled />,
        collapsedIcon: <WalletCreditCardOutlined />,
        iconClass: 'text-green',
        breadcrumbIcon: <WalletCreditCardFilled width={32} height={32} className="text-green" />,
        path: '/wallet',
        name: '/wallet',
        breadcrumb: 'Xem ví'
      },
      {
        title: 'Lịch sử',
        icon: <ArrowCounter />,
        collapsedIcon: <ArrowCounter />,
        iconClass: 'text-blue',
        breadcrumbIcon: <ArrowCounter width={32} height={32} className="text-blue" />,
        path: '/history',
        name: '/history',
        breadcrumb: 'Lịch sử'
      },
      {
        title: 'Tài khoản',
        icon: <Person />,
        collapsedIcon: <Person />,
        iconClass: 'text-blue',
        breadcrumbIcon: <PersonFilled width={32} height={32} className="text-blue" />,
        path: '/account-profile',
        name: '/account-profile',
        breadcrumb: 'Tài khoản',
        hidden: true
      },
      {
        title: 'Components',
        icon: <Apps />,
        iconClass: 'text-blue',
        breadcrumbIcon: <DashboardFilled width={32} height={32} className="text-primary" />,
        path: '/components',
        name: '/components',
        breadcrumb: 'Components',
        hidden: true
      }
    ]
  },
  {
    title: 'KHÁC',
    routes: [
      {
        title: 'Chương trình đại lý',
        icon: <CloudSwapFilled />,
        collapsedIcon: <CloudSwapOutlined />,
        iconClass: 'text-pink',
        breadcrumbIcon: <CloudSwapFilled width={32} height={32} className="text-pink" />,
        path: '/reseller',
        name: '/reseller',
        breadcrumb: 'Chương trình đại lý'
      },
      {
        title: 'Tài liệu API',
        icon: <DocumentSyncFilled />,
        collapsedIcon: <DocumentSync />,
        iconClass: 'text-primary',
        breadcrumbIcon: <DocumentSyncFilled width={32} height={32} className="text-primary" />,
        path: '/api-docs',
        name: '/api-docs',
        breadcrumb: 'Tài liệu API'
      }
    ]
  },
  {
    title: 'FOOTER',
    routes: [
      {
        title: 'Trợ giúp',
        icon: <ChatWarningFilled />,
        collapsedIcon: <ChatWarning />,
        iconClass: 'text-blue',
        breadcrumbIcon: <ChatWarningFilled width={32} height={32} className="text-blue" />,
        path: '/help',
        name: '/help',
        breadcrumb: 'Trợ giúp'
      },
      {
        title: (
          <div className="flex items-center justify-between">
            <span>Phần mềm hỗ trợ</span>
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
        breadcrumb: 'Phần mềm hỗ trợ'
      }
    ]
  }
];
