import { PricingCard } from '@/components/card/PricingCard';
import { ArrowRotate, Clock, DatabaseStackOutlined, Fire, ShieldCheckmark, TopSpeed } from '@/components/icons';
import { RadioGroup } from '@/components/radio/RadioGroup';
import { Tabs } from '@/components/tabs/Tabs';
import React, { useState } from 'react';
import OrderSummary, { OrderItemType } from './components/OrderSumary';
import CountrySelector, { Country } from './components/table/CountrySelector';
import PricingTable from './components/table/PricingTable';

// Data riêng cho 7 ngày và 30 ngày
const data7day = [
  { range: '1-9 IPs', price: 4, desc: '$4/IP' },
  { range: '10-24 IPs', price: 3.5, desc: '$3.5/IP' },
  { range: '25-49 IPs', price: 3, desc: '$3/IP' },
  { range: '51-99 IPs', price: 2.7, desc: '$2.7/IP' },
  { range: '100-299 IPs', price: 2.5, desc: '$2.5/IP' },
  { range: '>300 IPs', price: 2.35, desc: '$2.35/IP' }
];

const data30day = [
  { range: '1-9 IPs', price: 5, desc: '$5/IP' },
  { range: '10-24 IPs', price: 3.69, desc: '$3.69/IP' },
  { range: '25-49 IPs', price: 3.2, desc: '$3.2/IP' },
  { range: '51-99 IPs', price: 2.7, desc: '$2.9/IP' },
  { range: '100-299 IPs', price: 2.5, desc: '$2.7/IP' },
  { range: '>300 IPs', price: 2.35, desc: '$2.45/IP' }
];

type TabKey = 'rotating' | 'static' | 'dedicated';
type StaticSubKey = 'bandwidth' | 'unlimited';
type DedicatedSubKey = 'residential' | 'datacenter';
type SpeedLimitGroup = '5mbps' | '10mbps' | '25mbps' | '50mbps';
type ResidentialGroup = '7day' | '30day';
type DatacenterGroup = '7day' | '30day';

interface Plan {
  name: string;
  status: string;
}

const plansByType: {
  rotating: Record<SpeedLimitGroup, Plan[]>;
  static: Record<StaticSubKey, Plan[]>;
  dedicated: Plan[];
} = {
  rotating: {
    '5mbps': [
      { name: '5 Mbps Small', status: 'Đang hoạt động' },
      { name: '5 Mbps Pro', status: 'Đang hoạt động' },
      { name: '5 Mbps Pro', status: 'Đang hoạt động' },
      { name: '5 Mbps Pro', status: 'Đang hoạt động' },
      { name: '5 Mbps Pro', status: 'Đang hoạt động' },
      { name: '5 Mbps Pro', status: 'Đang hoạt động' }
    ],
    '10mbps': [
      { name: '10 Mbps Medium', status: 'Đang hoạt động' },
      { name: '10 Mbps Plus', status: 'Đang hoạt động' },
      { name: '10 Mbps Plus', status: 'Đang hoạt động' },
      { name: '10 Mbps Plus', status: 'Đang hoạt động' },
      { name: '10 Mbps Plus', status: 'Đang hoạt động' }
    ],
    '25mbps': [
      { name: '25 Mbps Large', status: 'Đang hoạt động' },
      { name: '25 Mbps Premium', status: 'Đang hoạt động' },
      { name: '25 Mbps Pro', status: 'Đang hoạt động' },
      { name: '25 Mbps Plus', status: 'Đang hoạt động' },
      { name: '25 Mbps Plus', status: 'Đang hoạt động' }
    ],
    '50mbps': [
      { name: '50 Mbps Large', status: 'Đang hoạt động' },
      { name: '50 Mbps Premium', status: 'Đang hoạt động' },
      { name: '50 Mbps Pro', status: 'Đang hoạt động' },
      { name: '50 Mbps Premium', status: 'Đang hoạt động' },
      { name: '50 Mbps Plus', status: 'Đang hoạt động' }
    ]
  },
  static: {
    bandwidth: [
      { name: 'Starter Plan: 5 Mbps', status: 'Đang hoạt động' },
      { name: 'Pro Plan: 15 Mbps', status: 'Đang hoạt động' },
      { name: 'Enterprise Plan: 50 Mbps', status: 'Đang hoạt động' },
      { name: 'Enterprise Plan: 50 Mbps', status: 'Đang hoạt động' },
      { name: 'Enterprise Plan: 50 Mbps', status: 'Đang hoạt động' }
    ],
    unlimited: [
      { name: 'Starter Plan: 5 Mbps', status: 'Đang hoạt động' },
      { name: 'Pro Plan: 15 Mbps', status: 'Đang hoạt động' },
      { name: 'Enterprise Plan: 50 Mbps', status: 'Đang hoạt động' },
      { name: 'Enterprise Plan: 50 Mbps', status: 'Đang hoạt động' },
      { name: 'Enterprise Plan: 50 Mbps', status: 'Đang hoạt động' }
    ]
  },
  dedicated: [
    { name: 'Dedicated Small', status: 'Đang hoạt động' },
    { name: 'Dedicated Medium', status: 'Đang hoạt động' },
    { name: 'Dedicated Large', status: 'Đang hoạt động' }
  ]
};

const PurchasePage: React.FC = () => {
  const [activeMain, setActiveMain] = useState<TabKey>('rotating');
  const [activeGroup, setActiveGroup] = useState<SpeedLimitGroup>('5mbps');
  const [activeStatic, setActiveStatic] = useState<StaticSubKey>('bandwidth');
  const [activeDedicated, setActiveDedicated] = useState<DedicatedSubKey>('residential');
  const [activeResidentialGroup, setActiveResidentialGroup] = useState<ResidentialGroup>('7day');

  const [orders, setOrders] = useState<OrderItemType[]>([]);

  // Bảng giá theo số lượng
  const getPricePerIp = (totalIps: number) => {
    if (totalIps <= 10) return 3;
    if (totalIps <= 50) return 2.5;
    return 2;
  };

  const handleAddCountry = (country: Country) => {
    setOrders((prev) => {
      const exist = prev.find((o) => o.country.id === country.id);
      let updated: OrderItemType[];

      if (exist) {
        updated = prev.map((o) => (o.country.id === country.id ? { ...o, quantity: o.quantity + 1 } : o));
      } else {
        updated = [...prev, { country, price: 0, quantity: 1 }]; // price sẽ set lại sau
      }

      // Tính lại tổng số IP
      const totalIps = updated.reduce((sum, o) => sum + o.quantity, 0);
      const pricePerIp = getPricePerIp(totalIps);

      // Cập nhật lại price cho tất cả item
      return updated.map((o) => ({ ...o, price: pricePerIp }));
    });
  };

  const handleUpdateQuantity = (country: Country, quantity: number) => {
    setOrders((prev) => {
      // Cập nhật số lượng country vừa thay đổi
      const updated = prev.map((o) =>
        o.country.id === country.id
          ? { ...o, quantity: Math.max(1, quantity) } // min = 1
          : o
      );

      // Tính lại tổng số IP
      const totalIps = updated.reduce((sum, o) => sum + o.quantity, 0);
      const pricePerIp = getPricePerIp(totalIps);

      // Gán lại price theo tier cho tất cả item
      return updated.map((o) => ({ ...o, price: pricePerIp }));
    });
  };

  const handleRemove = (country: Country) => {
    setOrders((prev) => prev.filter((o) => o.country.id !== country.id));
  };

  const handleClearAll = () => {
    setOrders([]);
  };

  // Các trang con tương ứng với radio chọn
  const residentialPages: Record<ResidentialGroup, JSX.Element> = {
    '7day': (
      <div className="flex flex-col md:flex-row h-[calc(100vh-270px)]">
        {/* Bên trái */}
        <div className={`flex-1 flex flex-col p-5 gap-10 overflow-y-auto ${orders.length ? '' : 'md:w-full'}`}>
          <PricingTable items={data7day} />
          <CountrySelector selected={orders.map((item) => item.country)} onSelect={handleAddCountry} onUnselect={handleRemove} />
        </div>

        {/* Bên phải */}
        {orders.length > 0 && (
          <div className="w-[473px] overflow-y-auto">
            <OrderSummary orders={orders} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} onClearAll={handleClearAll} />
          </div>
        )}
      </div>
    ),
    '30day': (
      <div className="flex flex-col md:flex-row h-[calc(100vh-270px)]">
        {/* Bên trái */}
        <div className={`flex-1 flex flex-col p-5 gap-10 overflow-y-auto ${orders.length ? '' : 'md:w-full'}`}>
          <PricingTable items={data30day} />
          <CountrySelector selected={orders.map((item) => item.country)} onSelect={handleAddCountry} onUnselect={handleRemove} />
        </div>

        {/* Bên phải */}
        {orders.length > 0 && (
          <div className="w-[473px] overflow-y-auto">
            <OrderSummary orders={orders} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} onClearAll={handleClearAll} />
          </div>
        )}
      </div>
    )
  };

  const mainTabs = [
    { label: 'Rotating', key: 'rotating' },
    { label: 'Static', key: 'static' },
    { label: 'Dedicated', key: 'dedicated' }
  ];

  const rotatingTabs = [{ label: 'Speed Limit', key: 'speedLimit' }];
  const staticTabs = [
    { label: 'Bandwidth', key: 'bandwidth' },
    { label: 'Unlimited', key: 'unlimited' }
  ];
  const dedicatedTabs = [
    { label: 'Residential', key: 'residential' },
    { label: 'Datacenter', key: 'datacenter' }
  ];

  const speedGroups: { label: string; key: SpeedLimitGroup }[] = [
    { label: 'Basic Plan: 5 MBPS', key: '5mbps' },
    { label: 'Standard Plan: 10 MBPS', key: '10mbps' },
    { label: 'Advanced Plan: 25 MBPS', key: '25mbps' },
    { label: 'Premium Plan: 50 MBPS', key: '50mbps' }
  ];

  const residentialGroups: { label: string; key: ResidentialGroup }[] = [
    { label: '7 ngày', key: '7day' },
    { label: '30 ngày', key: '30day' }
  ];

  return (
    <div className="">
      {/* Main Tabs */}
      <Tabs tabs={mainTabs} activeKey={activeMain} onChange={(key) => setActiveMain(key as TabKey)}>
        {/* Rotating */}
        <div key="rotating">
          <Tabs type="card" tabs={speedGroups} activeKey={activeGroup} onChange={(key) => setActiveGroup(key as SpeedLimitGroup)}>
            {speedGroups.map((g) => (
              <div
                key={g.key}
                className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5 p-5 max-h-[calc(100vh-215px)] overflow-y-auto"
              >
                {plansByType.rotating[g.key].map((plan) => (
                  <PricingCard
                    tag={{ text: 'POPULAR', icon: <Fire /> }}
                    description="Ideal proxies for any use case & purpose. By accesing our 10M+ IP pool non-subnet linked, bans and blocks are non-existent."
                    title={plan.name}
                    price="4.50"
                    features={[
                      {
                        icon: <ShieldCheckmark className="w-6 h-6 text-primary" />,
                        label: (
                          <div className="text-base">
                            <label htmlFor="">Hỗ trợ: </label>
                            <span className="font-bold">HTTP/HTTPS</span>
                          </div>
                        )
                      },
                      {
                        icon: <Clock className="w-6 h-6 text-yellow" />,
                        label: (
                          <div className="text-base">
                            <label htmlFor="">Thời gian xoay IP: </label>
                            <span className="font-bold">10 phút</span>
                          </div>
                        )
                      },
                      {
                        icon: <DatabaseStackOutlined className="w-6 h-6 text-green" />,
                        label: (
                          <div className="text-base">
                            <label htmlFor="">Băng thông: </label>
                            <span className="font-bold">Không giới hạn</span>
                          </div>
                        )
                      },
                      {
                        icon: <ArrowRotate className="w-6 h-6 text-blue" />,
                        label: (
                          <div className="text-base">
                            <label htmlFor="">Lượt xoay IP: </label>
                            <span className="font-bold">Không giới hạn</span>
                          </div>
                        )
                      },
                      {
                        icon: <TopSpeed className="w-6 h-6 text-pink" />,
                        label: (
                          <div className="text-base">
                            <label htmlFor="">Tăng tốc: </label>
                            <span className="font-bold">50Mbps</span>
                          </div>
                        )
                      }
                    ]}
                    buttonText="MUA GÓI"
                    onClick={() => alert('Mua gói')}
                  />
                ))}
              </div>
            ))}
          </Tabs>
        </div>

        {/* Static */}
        <div key="static">
          <Tabs type="card" tabs={staticTabs} activeKey={activeStatic} onChange={(key) => setActiveStatic(key as StaticSubKey)}>
            {[
              // Speed Limit → Nhóm gói
              <div key="bandwidth">
                <div
                  key={'bandwidth'}
                  className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5 p-5 max-h-[calc(100vh-215px)] overflow-y-auto"
                >
                  {plansByType.static['bandwidth'].map((plan) => (
                    <PricingCard
                      tag={{ text: 'POPULAR', icon: <Fire /> }}
                      description="Ideal proxies for any use case & purpose. By accesing our 10M+ IP pool non-subnet linked, bans and blocks are non-existent."
                      title={plan.name}
                      price="4.50"
                      features={[
                        {
                          icon: <ShieldCheckmark className="w-6 h-6 text-primary" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Hỗ trợ: </label>
                              <span className="font-bold">HTTP/HTTPS</span>
                            </div>
                          )
                        },
                        {
                          icon: <Clock className="w-6 h-6 text-yellow" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Thời gian xoay IP: </label>
                              <span className="font-bold">10 phút</span>
                            </div>
                          )
                        },
                        {
                          icon: <DatabaseStackOutlined className="w-6 h-6 text-green" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Băng thông: </label>
                              <span className="font-bold">Không giới hạn</span>
                            </div>
                          )
                        },
                        {
                          icon: <ArrowRotate className="w-6 h-6 text-blue" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Lượt xoay IP: </label>
                              <span className="font-bold">Không giới hạn</span>
                            </div>
                          )
                        },
                        {
                          icon: <TopSpeed className="w-6 h-6 text-pink" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Tăng tốc: </label>
                              <span className="font-bold">50Mbps</span>
                            </div>
                          )
                        }
                      ]}
                      buttonText="MUA GÓI"
                      onClick={() => alert('Mua gói')}
                    />
                  ))}
                </div>
              </div>,
              <div key="unlimited">
                <div
                  key={'unlimited'}
                  className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5 p-5 max-h-[calc(100vh-215px)] overflow-y-auto"
                >
                  {plansByType.static['unlimited'].map((plan) => (
                    <PricingCard
                      tag={{ text: 'POPULAR', icon: <Fire /> }}
                      description="Ideal proxies for any use case & purpose. By accesing our 10M+ IP pool non-subnet linked, bans and blocks are non-existent."
                      title={plan.name}
                      price="4.50"
                      features={[
                        {
                          icon: <ShieldCheckmark className="w-6 h-6 text-primary" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Hỗ trợ: </label>
                              <span className="font-bold">HTTP/HTTPS</span>
                            </div>
                          )
                        },
                        {
                          icon: <Clock className="w-6 h-6 text-yellow" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Thời gian xoay IP: </label>
                              <span className="font-bold">10 phút</span>
                            </div>
                          )
                        },
                        {
                          icon: <DatabaseStackOutlined className="w-6 h-6 text-green" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Băng thông: </label>
                              <span className="font-bold">Không giới hạn</span>
                            </div>
                          )
                        },
                        {
                          icon: <ArrowRotate className="w-6 h-6 text-blue" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Lượt xoay IP: </label>
                              <span className="font-bold">Không giới hạn</span>
                            </div>
                          )
                        },
                        {
                          icon: <TopSpeed className="w-6 h-6 text-pink" />,
                          label: (
                            <div className="text-base">
                              <label htmlFor="">Tăng tốc: </label>
                              <span className="font-bold">50Mbps</span>
                            </div>
                          )
                        }
                      ]}
                      buttonText="MUA GÓI"
                      onClick={() => alert('Mua gói')}
                    />
                  ))}
                </div>
              </div>
            ]}
          </Tabs>
        </div>

        {/* Dedicated */}
        <div key="dedicated">
          <div className="">
            <Tabs
              type="card"
              tabs={dedicatedTabs}
              activeKey={activeDedicated}
              onChange={(key) => setActiveDedicated(key as DedicatedSubKey)}
            >
              {[
                <div key="residential">
                  <div className="px-5 py-4 border-b-2 border-border-element dark:border-border-element-dark">
                    <RadioGroup
                      value={activeResidentialGroup}
                      onChange={(value) => setActiveResidentialGroup(value as ResidentialGroup)}
                      options={residentialGroups.map((r) => ({
                        key: r.key,
                        label: r.label,
                        value: r.key,
                        variant: 'secondary'
                      }))}
                      direction="row"
                    />
                  </div>
                  {residentialPages[activeResidentialGroup]}
                </div>
              ]}
            </Tabs>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default PurchasePage;
