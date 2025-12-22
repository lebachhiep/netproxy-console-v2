import React, { useMemo, useState, useEffect } from 'react';
import { Plan, Country } from '@/services/plan/plan.types';
import { RadioGroup } from '@/components/radio/RadioGroup';
import { CountryTag } from '@/components/tag/CountryTag';
import { Button } from '@/components/button/Button';
import { planService } from '@/services/plan/plan.service';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import countriesLib from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import vi from 'i18n-iso-countries/langs/vi.json';
import OrderSummary from './OrderSumary';
import { CartTabKey, getTabKeyFromPlan } from '@/contexts/CartContext';
import { Country as OrderCountry } from './table/CountrySelector';
import { Tabs } from '@/components/tabs/Tabs';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Loader } from '@/components/loader';
import { useMutation } from '@tanstack/react-query';

// Register locales
countriesLib.registerLocale(en);
countriesLib.registerLocale(vi);

// Helper function to get country name from code in Vietnamese
const getCountryName = (code: string, locale?: string): string => {
  if (locale) {
    return countriesLib.getName(code, locale, { select: 'official' }) || code;
  }
  return countriesLib.getName(code, 'vi', { select: 'official' }) || countriesLib.getName(code, 'en', { select: 'official' }) || code;
};

interface DedicatedPlanFilterProps {
  plans: Plan[];
  proxyType?: string; // Proxy type name (tab name) like "Premium ISP", "Private IPv4", etc.
  servers?: string[]; // Ordered list of servers from API
}

interface SelectedCountry {
  code: string;
  name: string;
  quantity: number;
  price: number; // Price per IP
  total: number; // Total price for this country
  availableCount?: number;
}

// Helper to get period in days - CHỈ dùng metadata.period
const getPeriodDays = (plan: Plan): number | null => {
  const period = plan.metadata?.period;
  if (period && typeof period === 'number' && period > 0) {
    return period;
  }
  return null;
};

export const DedicatedPlanFilter: React.FC<DedicatedPlanFilterProps> = ({ plans, proxyType, servers }) => {
  const { t, i18n } = useTranslation();
  const cart = useCart();
  // Filter state
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number | ''>('');
  const [quantityBoundary, setQuantityBoundary] = useState<{ min: number; max?: number }>({ min: 1 });

  // Determine tab key for this component (based on first plan or proxyType)
  const tabKey: CartTabKey = useMemo(() => {
    if (plans.length > 0) {
      return getTabKeyFromPlan(plans[0]);
    }
    // Fallback based on proxyType
    if (proxyType === 'Premium ISP') return 'premium_isp';
    if (proxyType === 'Private IPv4') return 'private_ipv4';
    if (proxyType === 'Shared IPv4') return 'shared_ipv4';
    if (proxyType === 'IPv6') return 'ipv6';
    return 'private_ipv4'; // default
  }, [plans, proxyType]);

  // Countries state
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryRequired, setCountryRequired] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  // Selected countries in cart (local state for display)
  const [selectedCountries, setSelectedCountries] = useState<Map<string, SelectedCountry>>(new Map());
  // const [calculatingPrices, setCalculatingPrices] = useState<Set<string>>(new Set());
  // const priceCalculationRefs = React.useRef<Map<string, number>>(new Map());
  // const [updateTrigger, setUpdateTrigger] = useState(0);
  const isUpdatingCartRef = React.useRef<Set<string>>(new Set()); // Track countries being updated to prevent sync loop

  // Extract available servers from API prop or fallback to extracting from plans
  const availableServers = useMemo(() => {
    // If servers prop is provided (from API), use it in the provided order
    if (servers && servers.length > 0) {
      return servers;
    }

    // Fallback: extract from plans and sort alphabetically
    const serverSet = new Set<string>();
    plans.forEach((plan) => {
      if (plan.provider_name) {
        serverSet.add(plan.provider_name);
      }
    });
    return Array.from(serverSet).sort();
  }, [plans, servers]);

  const calculatePlanPriceMutation = useMutation({
    mutationKey: ['calculate-plan-price'],
    mutationFn: async (variables: { planId: string; countryCode: string }) =>
      await planService.calculatePlanPrice(variables.planId, {
        country: variables.countryCode
      })
  });

  // Filter plans by server để tính available periods
  const plansFilteredByServer = useMemo(() => {
    if (!selectedServer) return plans;
    return plans.filter((plan) => plan.provider_name === selectedServer);
  }, [plans, selectedServer]);

  // Extract available periods từ plans đã filter bởi server
  const availablePeriods = useMemo(() => {
    const periods = new Set<number>();
    plansFilteredByServer.forEach((plan) => {
      const periodDays = getPeriodDays(plan);
      if (periodDays !== null) {
        periods.add(periodDays);
      }
    });
    return Array.from(periods).sort((a, b) => a - b);
  }, [plansFilteredByServer]);

  // Helmet page title
  const pageTitle = usePageTitle({
    pageName: 'Mua hàng',
    tabName: plans[0] ? getTabKeyFromPlan(plans[0]) : '',
    plan: selectedServer
  });

  // Initialize server when plans change
  useEffect(() => {
    if (availableServers.length > 0) {
      if (!selectedServer || !availableServers.includes(selectedServer)) {
        setSelectedServer(availableServers[0]);
      }
    } else {
      setSelectedServer('');
    }
  }, [availableServers]);

  // Reset period when server changes hoặc period không còn hợp lệ
  useEffect(() => {
    if (availablePeriods.length > 0) {
      if (!selectedPeriod || !availablePeriods.includes(selectedPeriod as number)) {
        setSelectedPeriod(availablePeriods[0]);
      }
    } else {
      setSelectedPeriod('');
    }
  }, [availablePeriods, selectedServer]);

  // Filter plans based on selections - lọc theo server (provider_name) và period (metadata.period)
  const filteredPlans = useMemo(() => {
    let filtered = plans;

    // Filter by server (provider_name)
    if (selectedServer) {
      filtered = filtered.filter((plan) => plan.provider_name === selectedServer);
    }

    // Filter by period (metadata.period)
    if (selectedPeriod) {
      filtered = filtered.filter((plan) => {
        const planPeriodDays = getPeriodDays(plan);
        return planPeriodDays === selectedPeriod;
      });
    }

    return filtered;
  }, [plans, selectedServer, selectedPeriod]);

  // Get the selected plan (first one from filtered plans)
  const selectedPlan = useMemo(() => {
    const result = filteredPlans.length > 0 ? filteredPlans[0] : null;
    if (result && result?.metadata && result?.metadata?.min_order_quantity) {
      setQuantityBoundary((prev) => ({ ...prev, min: result?.metadata?.min_order_quantity || 1 }));
    }
    return result;
  }, [filteredPlans]);

  // Fetch countries when server and period are selected
  useEffect(() => {
    if (selectedPlan && selectedServer && selectedPeriod) {
      fetchCountries();
    } else {
      setCountries([]);
      setSelectedCountries(new Map());
    }
  }, [selectedPlan?.id, selectedServer, selectedPeriod]);

  const fetchCountries = async () => {
    if (!selectedPlan) return;

    try {
      setCountriesLoading(true);
      setCountriesError(null);
      setSelectedCountries(new Map());

      const response = await planService.getPlanCountries(selectedPlan.id);

      // Filter out unavailable countries
      const availableCountries = response.countries.filter((c) => c.available);
      setCountries(availableCountries);
      setCountryRequired(response.country_required);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setCountriesError('Không thể tải danh sách quốc gia');
      toast.error('Không thể tải danh sách quốc gia');
    } finally {
      setCountriesLoading(false);
    }
  };

  const calculatePriceForCountry = async (countryCode: string): Promise<{ price: number; availableCount?: number }> => {
    if (!selectedPlan)
      return {
        price: 0
      };

    try {
      const response = await calculatePlanPriceMutation.mutateAsync({
        countryCode,
        planId: selectedPlan.id
      });

      // Return price per IP (total price / quantity)
      return {
        price: response.price,
        availableCount: response?.available_count
      };
    } catch (err) {
      console.error('Failed to calculate price:', err);
      toast.error('Không thể tính giá cho quốc gia đã chọn');
      // Fallback to plan price
      return {
        price: selectedPlan.price || 0
      };
    }
  };

  const handleCountryToggle = async (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (!country || !selectedPlan) return;

    const countryName = getCountryName(countryCode, i18n.language);
    const newMap = new Map(selectedCountries);

    if (newMap.has(countryCode)) {
      // Remove country - also remove from cart
      const selected = newMap.get(countryCode);
      if (selected) {
        // Find and remove from cart
        const durationOption = selectedPeriod === 7 ? '7day' : selectedPeriod === 30 ? '30day' : undefined;
        const tabItems = cart.getTabItems(tabKey);
        const cartItem = tabItems.find(
          (item) => item.plan.id === selectedPlan.id && item.country === countryCode && item.duration === durationOption
        );
        if (cartItem) {
          cart.removeItem(tabKey, cartItem.id);
        }
      }
      newMap.delete(countryCode);
      setSelectedCountries(newMap);
    } else {
      // Add country with default quantity 1
      // setCalculatingPrices((prev) => new Set(prev).add(countryCode));

      // Use fallback price first, then calculate real price
      const fallbackPrice = selectedPlan.price || 0;
      const newSelected: SelectedCountry = {
        code: countryCode,
        name: countryName,
        quantity: 1,
        price: fallbackPrice,
        total: fallbackPrice
      };
      newMap.set(countryCode, newSelected);
      setSelectedCountries(newMap);

      // Calculate real price asynchronously with quantity=1
      calculatePriceForCountry(countryCode).then(({ price: pricePerIP, availableCount }) => {
        const updated = new Map(newMap);
        const existing = updated.get(countryCode);
        if (existing) {
          // pricePerIP is already price per IP (from quantity=1)
          const finalPrice = pricePerIP;
          const finalTotal = finalPrice * quantityBoundary.min; // quantity is 1

          updated.set(countryCode, {
            ...existing,
            price: finalPrice, // Price per IP
            total: finalTotal,
            availableCount
          });
          setSelectedCountries(updated);

          // Add to cart with calculated price (total for quantity 1)
          const durationOption = selectedPeriod === 7 ? '7day' : selectedPeriod === 30 ? '30day' : undefined;
          cart.addToCart(tabKey, selectedPlan, quantityBoundary.min, { duration: durationOption }, countryCode, finalTotal, {
            min: quantityBoundary.min,
            max: availableCount
          });
          toast.success(`Đã thêm ${countryName} vào giỏ hàng`);
        }
      });
    }
  };

  const handleRemoveCountry = (countryCode: string) => {
    if (!selectedPlan) return;

    const newMap = new Map(selectedCountries);
    const selected = newMap.get(countryCode);

    if (selected) {
      // Remove from cart
      const durationOption = selectedPeriod === 7 ? '7day' : selectedPeriod === 30 ? '30day' : undefined;
      const tabItems = cart.getTabItems(tabKey);
      const cartItem = tabItems.find(
        (item) => item.plan.id === selectedPlan.id && item.country === countryCode && item.duration === durationOption
      );
      if (cartItem) {
        cart.removeItem(tabKey, cartItem.id);
      }
    }

    newMap.delete(countryCode);
    setSelectedCountries(newMap);
  };

  // Sync selectedCountries with cart items (but skip if we're currently updating)
  useEffect(() => {
    if (!selectedPlan) return;

    // Skip sync if any country is being updated
    if (isUpdatingCartRef.current.size > 0) {
      return;
    }

    const newMap = new Map<string, SelectedCountry>();
    const durationOption = selectedPeriod === 7 ? '7day' : selectedPeriod === 30 ? '30day' : undefined;

    const tabItems = cart.getTabItems(tabKey);
    tabItems.forEach((item) => {
      if (item.plan.id === selectedPlan.id && item.duration === durationOption && item.country) {
        // Skip if this country is being updated
        if (isUpdatingCartRef.current.has(item.country)) {
          return;
        }

        const countryName = getCountryName(item.country, i18n.language);

        // Calculate price per IP: if calculatedPrice exists, divide by quantity
        // Otherwise use plan.price as price per IP
        const pricePerIP = item.calculatedPrice ? item.calculatedPrice / item.quantity : item.plan.price;

        // Total price = price per IP * quantity
        const totalPrice = item.calculatedPrice ?? item.plan.price * item.quantity;

        newMap.set(item.country, {
          code: item.country,
          name: countryName,
          quantity: item.quantity,
          price: pricePerIP, // Price per IP
          total: totalPrice
        });
      }
    });

    setSelectedCountries(newMap);
  }, [cart.itemsByTab, tabKey, selectedPlan?.id, selectedPeriod]);

  // Build server options
  const serverOptions = availableServers
    .slice()
    .sort((a, b) => {
      if (a.toLowerCase() === 'dawn server') return 1;
      if (b.toLowerCase() === 'dawn server') return -1;
      return a.localeCompare(b);
    })
    .map((server) => ({
      key: server,
      label: server,
      value: server
    }));

  // Build period options
  const periodOptions = availablePeriods.map((period) => ({
    key: `${period}d`,
    label: `${period} ${t('day')}`,
    value: period
  }));

  // Group countries by region
  const asiaCountryCodes = new Set([
    'CN',
    'BD',
    'ID',
    'IN',
    'VN',
    'TH',
    'PH',
    'MY',
    'SG',
    'JP',
    'KR',
    'PK',
    'LK',
    'NP',
    'MM',
    'MN',
    'KH',
    'LA',
    'JO',
    'AF',
    'AM',
    'AZ',
    'BH',
    'BN',
    'BT',
    'CC',
    'GE',
    'HK',
    'IL',
    'IQ',
    'IR',
    'KG',
    'KZ',
    'LB',
    'MO',
    'MV',
    'OM',
    'PS',
    'QA',
    'SA',
    'SY',
    'TJ',
    'TM',
    'TR',
    'TW',
    'UZ',
    'YE',
    'AE'
  ]);

  const europeCountryCodes = new Set([
    'AL',
    'AD',
    'AT',
    'BY',
    'BE',
    'BA',
    'BG',
    'HR',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IS',
    'IE',
    'IT',
    'LV',
    'LI',
    'LT',
    'LU',
    'MT',
    'MD',
    'MC',
    'ME',
    'NL',
    'MK',
    'NO',
    'PL',
    'PT',
    'RO',
    'RU',
    'SM',
    'RS',
    'SK',
    'SI',
    'ES',
    'SE',
    'CH',
    'UA',
    'GB',
    'VA',
    'XK'
  ]);

  const asiaCountries = useMemo(() => {
    return countries.filter((c) => asiaCountryCodes.has(c.code.toUpperCase()));
  }, [countries]);

  const europeCountries = useMemo(() => {
    return countries.filter((c) => europeCountryCodes.has(c.code.toUpperCase()));
  }, [countries]);

  const otherCountries = useMemo(() => {
    const allGrouped = new Set([...asiaCountries.map((c) => c.code), ...europeCountries.map((c) => c.code)]);
    return countries.filter((c) => !allGrouped.has(c.code));
  }, [countries, asiaCountries, europeCountries]);

  // Component to render filtered OrderSummary
  const FilteredOrderSummary: React.FC<{ selectedPlan: Plan; selectedPeriod: number }> = ({ selectedPlan, selectedPeriod }) => {
    const durationOption = selectedPeriod === 7 ? '7day' : selectedPeriod === 30 ? '30day' : undefined;

    // Filter cart items for this plan and duration
    const filteredItems = useMemo(() => {
      const tabItems = cart.getTabItems(tabKey);
      return tabItems.filter((item) => item.plan.id === selectedPlan.id && item.duration === durationOption);
    }, [cart.itemsByTab, selectedPlan.id, durationOption]);

    // Convert CartItem to OrderItemType format
    const orderItems = useMemo(() => {
      console.log('filtered items: ...', filteredItems);
      return filteredItems.map((item) => {
        // Calculate price per IP: if calculatedPrice exists, divide by quantity
        // Otherwise use plan.price as price per IP
        const pricePerIP = item.calculatedPrice ? item.calculatedPrice / item.quantity : item.plan.price;

        return {
          country: {
            id: item.country || '',
            name: item.country ? getCountryName(item.country, i18n.language) : '',
            code: item.country?.toLowerCase() || ''
          } as OrderCountry,
          price: pricePerIP,
          quantity: item.quantity,
          quantityBoundary: item?.quantityBoundary
        };
      });
    }, [filteredItems]);

    // Handlers for OrderSummary
    const handleUpdateQuantity = (country: OrderCountry, quantity: number) => {
      const item = filteredItems.find((i) => i.country?.toLowerCase() === country.code);

      if (item) {
        if (quantity < 1) {
          cart.removeItem(tabKey, item.id);
        } else {
          // Calculate price per IP from current cart item
          const pricePerIP = item.calculatedPrice ? item.calculatedPrice / item.quantity : item.plan.price;

          // Calculate new total = price per IP * new quantity
          const newTotal = pricePerIP * quantity;

          // Update cart with new quantity and total
          cart.updateCartItem(tabKey, item.id, quantity, newTotal);
        }
      }
    };

    const handleRemove = (country: OrderCountry) => {
      const item = filteredItems.find((i) => i.country?.toLowerCase() === country.code);
      if (item) {
        cart.removeItem(tabKey, item.id);
      }
    };

    if (!orderItems.length) {
      return null;
    }

    // If no items, show empty state
    if (orderItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100dvh-270px)] bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark text-center p-8">
          <p className="text-text-me dark:text-text-me-dark">{t('noCountrySelected')}</p>
        </div>
      );
    }

    // Get proxyType from plan metadata or use prop
    const displayProxyType = proxyType || selectedPlan.metadata?.proxy_type || 'Dedicated Proxy';

    // Render OrderSummary with useCartContext=true to enable coupon and balance features
    // But pass filtered orders to override the display
    return (
      <OrderSummary
        useCartContext={true}
        orders={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        proxyType={displayProxyType}
        duration={selectedPeriod}
        filterPlanType={'dedicated'}
      />
    );
  };

  return (
    <div className="flex gap-5 h-full w-full flex-1 flex-col">
      {pageTitle}
      <Tabs
        type="card"
        tabs={serverOptions}
        activeKey={selectedServer}
        onChange={(value) => {
          setSelectedServer(String(value));
          setSelectedCountries(new Map());
          cart.clearTabCart(tabKey);
          cart.clearCart();
        }}
        className="w-full h-full flex-1 flex flex-col"
        cardWrapperClass="w-full h-full flex-1 flex flex-col"
        contentCardWrapperClass="h-full flex-1 flex flex-col"
      >
        {serverOptions &&
          serverOptions.map((server) => {
            return (
              <div id={server.key} className="w-full h-full" key={server.key}>
                <Loader isLoading={countriesLoading || calculatePlanPriceMutation.isPending} className="flex flex-row gap-2 flex-1 h-full">
                  {/* Left Panel - Filters and Country Selection */}
                  <div className="flex-1 max-h-[calc(100dvh-215px)] flex flex-col">
                    {/* Filters Section */}
                    <div className="border-b-2 border-border-element dark:border-border-element-dark">
                      {periodOptions.length > 0 && (
                        <div className="flex flex-col gap-2 whitespace-nowrap scrollbar-hide overflow-auto">
                          <RadioGroup
                            className="overflow-visible px-5 py-4"
                            value={selectedPeriod}
                            onChange={(value) => {
                              setSelectedPeriod(Number(value));
                              setSelectedCountries(new Map());
                              cart.clearTabCart(tabKey);
                            }}
                            options={periodOptions}
                            direction="row"
                          />
                        </div>
                      )}
                    </div>

                    {/* Error State */}
                    {countriesError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{countriesError}</p>
                        <Button variant="default" size="sm" onClick={fetchCountries} className="mt-2 capitalize">
                          {t('retry')}
                        </Button>
                      </div>
                    )}

                    {/* Loading State */}
                    {selectedPlan && selectedServer && selectedPeriod ? (
                      <div className="space-y-4 p-5 flex-1 w-full h-full  overflow-y-auto">
                        {/* Country Selection */}
                        <div>
                          <label className="text-text-hi dark:text-text-hi-dark font-medium mb-2 block">
                            {t('country')}: {countryRequired && <span className="text-red-500">*</span>}
                          </label>

                          {!countriesLoading && countries.length === 0 ? (
                            <div className="p-4 text-center text-text-lo dark:text-text-lo-dark border border-border-element dark:border-border-element-dark rounded-lg">
                              {t('noAvaiCountry')}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Asia Countries */}
                              {asiaCountries.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-medium text-text-me dark:text-text-me-dark mb-2 capitalize">{t('asia')}</h3>
                                  <div className="flex flex-wrap gap-3">
                                    {asiaCountries.map((country) => {
                                      const isSelected = selectedCountries.has(country.code);
                                      return (
                                        <CountryTag
                                          key={country.code}
                                          name={getCountryName(country.code, i18n.language)}
                                          flagUrl={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                          active={isSelected}
                                          removable={isSelected}
                                          onClick={() => handleCountryToggle(country.code)}
                                          onRemove={() => handleRemoveCountry(country.code)}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Europe Countries */}
                              {europeCountries.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-medium text-text-me dark:text-text-me-dark mb-2">{t('europe')}</h3>
                                  <div className="flex flex-wrap gap-3">
                                    {europeCountries.map((country) => {
                                      const isSelected = selectedCountries.has(country.code);
                                      return (
                                        <CountryTag
                                          key={country.code}
                                          name={getCountryName(country.code, i18n.language)}
                                          flagUrl={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                          active={isSelected}
                                          removable={isSelected}
                                          onClick={() => handleCountryToggle(country.code)}
                                          onRemove={() => handleRemoveCountry(country.code)}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Other Countries */}
                              {otherCountries.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-medium text-text-me dark:text-text-me-dark mb-2">{t('otherRegions')}</h3>
                                  <div className="flex flex-wrap gap-3">
                                    {otherCountries.map((country) => {
                                      const isSelected = selectedCountries.has(country.code);
                                      return (
                                        <CountryTag
                                          key={country.code}
                                          name={getCountryName(country.code, i18n.language)}
                                          flagUrl={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                          active={isSelected}
                                          removable={isSelected}
                                          onClick={() => handleCountryToggle(country.code)}
                                          onRemove={() => handleRemoveCountry(country.code)}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : !countriesLoading ? (
                      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                        <p className="text-text-me dark:text-text-me-dark">{t('pleaseSelectServerAndDuration')}</p>
                      </div>
                    ) : null}
                  </div>
                  {/* Right Panel - Cart Summary */}
                  {selectedPlan && selectedServer && selectedPeriod && selectedCountries.size > 0 && (
                    <div className="min-h-[480px] w-[473px] hidden lg:block overflow-y-auto max-h-[calc(100dvh-215px)]">
                      <FilteredOrderSummary selectedPlan={selectedPlan} selectedPeriod={selectedPeriod} />
                    </div>
                  )}
                </Loader>
              </div>
            );
          })}
      </Tabs>
    </div>
  );
};
