import React, { useState, useEffect, useMemo } from 'react';
import { CountryTag } from '@/components/tag/CountryTag';
import { Button } from '@/components/button/Button';
import { Add, Subtract } from '@/components/icons';
import { Plan } from '@/services/plan/plan.types';
import { planService } from '@/services/plan/plan.service';
import { toast } from 'sonner';
import { Country } from '@/services/plan/plan.types';
import countriesLib from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import vi from 'i18n-iso-countries/langs/vi.json';
import { useCart } from '@/hooks/useCart';
import { getTabKeyFromPlan } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';

// Register locales
countriesLib.registerLocale(en);
countriesLib.registerLocale(vi);

// Helper function to get country name from code in Vietnamese
const getCountryName = (code: string): string => {
  return countriesLib.getName(code, 'vi', { select: 'official' }) || countriesLib.getName(code, 'en', { select: 'official' }) || code;
};

interface SelectedCountry {
  code: string;
  name: string;
  quantity: number;
  price: number; // Price per IP
  total: number; // Total price for this country
}

interface DedicatedPlanSelectorProps {
  plan: Plan;
}

// IP Quantity Pricing Tiers
const PRICING_TIERS = [
  { range: '1-9 IPs', price: 4.0 },
  { range: '10-24 IPs', price: 3.5 },
  { range: '25-49 IPs', price: 3.0 },
  { range: '51-99 IPs', price: 2.7 },
  { range: '100-299 IPs', price: 2.5 },
  { range: '>300 IPs', price: 2.35 }
];

// Helper to get price per IP based on quantity
const getPricePerIP = (quantity: number): number => {
  if (quantity >= 300) return PRICING_TIERS[5].price;
  if (quantity >= 100) return PRICING_TIERS[4].price;
  if (quantity >= 51) return PRICING_TIERS[3].price;
  if (quantity >= 25) return PRICING_TIERS[2].price;
  if (quantity >= 10) return PRICING_TIERS[1].price;
  return PRICING_TIERS[0].price;
};

export const DedicatedPlanSelector: React.FC<DedicatedPlanSelectorProps> = ({ plan }) => {
  const { t } = useTranslation();
  const cart = useCart();
  const [selectedCountries, setSelectedCountries] = useState<Map<string, SelectedCountry>>(new Map());
  const [duration, setDuration] = useState<'7day' | '30day'>('7day');
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryRequired, setCountryRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculatingPrices, setCalculatingPrices] = useState<Set<string>>(new Set());
  const priceCalculationRefs = React.useRef<Map<string, number>>(new Map());
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Fetch countries when plan changes
  useEffect(() => {
    fetchCountries();
  }, [plan.id]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCountries(new Map());

      const response = await planService.getPlanCountries(plan.id);

      // Filter out unavailable countries
      const availableCountries = response.countries.filter((c) => c.available);
      setCountries(availableCountries);
      setCountryRequired(response.country_required);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Không thể tải danh sách quốc gia');
      toast.error('Không thể tải danh sách quốc gia');
    } finally {
      setLoading(false);
    }
  };

  const calculatePriceForCountry = async (countryCode: string, quantity: number): Promise<number> => {
    try {
      const response = await planService.calculatePlanPrice(plan.id, {
        country: countryCode
      });
      return response.price / quantity; // Return price per IP
    } catch (err) {
      console.error('Failed to calculate price:', err);
      // Fallback to tier-based pricing
      return getPricePerIP(quantity);
    }
  };

  const handleCountryToggle = async (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (!country) return;

    const countryName = getCountryName(countryCode);
    const newMap = new Map(selectedCountries);

    if (newMap.has(countryCode)) {
      // Remove country
      newMap.delete(countryCode);
      setSelectedCountries(newMap);
    } else {
      // Add country with default quantity 1
      setCalculatingPrices((prev) => new Set(prev).add(countryCode));

      // Use fallback price first, then calculate real price
      const fallbackPrice = getPricePerIP(1);
      newMap.set(countryCode, {
        code: countryCode,
        name: countryName,
        quantity: 1,
        price: fallbackPrice,
        total: fallbackPrice
      });
      setSelectedCountries(newMap);

      // Calculate real price asynchronously
      calculatePriceForCountry(countryCode, 1).then((pricePerIP) => {
        setSelectedCountries((prev) => {
          const updated = new Map(prev);
          const existing = updated.get(countryCode);
          if (existing) {
            updated.set(countryCode, {
              ...existing,
              price: pricePerIP,
              total: pricePerIP * existing.quantity
            });
          }
          return updated;
        });
        setCalculatingPrices((prev) => {
          const next = new Set(prev);
          next.delete(countryCode);
          return next;
        });
      });
    }
  };

  const handleQuantityChange = async (countryCode: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const selected = selectedCountries.get(countryCode);
    if (!selected) return;

    // Capture the quantity and current price to avoid race conditions
    const targetQuantity = newQuantity;
    const currentPrice = selected.price;

    // Store request ID to track the latest request
    const requestId = Date.now();
    priceCalculationRefs.current.set(countryCode, requestId);

    // Update quantity immediately with current price
    setSelectedCountries((prev) => {
      const next = new Map(prev);
      const existing = next.get(countryCode);
      if (existing) {
        next.set(countryCode, {
          ...existing,
          quantity: targetQuantity,
          total: currentPrice * targetQuantity
        });
        // Force re-render to update total price
        setUpdateTrigger((prev) => prev + 1);
      }
      return next;
    });

    // Calculate new price asynchronously
    setCalculatingPrices((prev) => new Set(prev).add(countryCode));

    calculatePriceForCountry(countryCode, targetQuantity)
      .then((pricePerIP) => {
        // Check if this is still the latest request for this country
        const latestRequestId = priceCalculationRefs.current.get(countryCode);
        if (latestRequestId !== requestId) {
          // This is a stale response, ignore it
          setCalculatingPrices((prev) => {
            const next = new Set(prev);
            next.delete(countryCode);
            return next;
          });
          return;
        }

        // Update with functional update to ensure we get the latest state
        setSelectedCountries((prev) => {
          const next = new Map(prev);
          const existing = next.get(countryCode);
          // Only update if this country still exists and quantity matches what we requested
          if (existing && existing.quantity === targetQuantity) {
            const newTotal = pricePerIP * targetQuantity;
            next.set(countryCode, {
              ...existing,
              price: pricePerIP,
              total: newTotal
            });
            // Force re-render by updating trigger
            setUpdateTrigger((prev) => prev + 1);
          }
          return next;
        });

        setCalculatingPrices((prev) => {
          const next = new Set(prev);
          next.delete(countryCode);
          return next;
        });
      })
      .catch((err) => {
        console.error('Error calculating price:', err);
        // Only clear calculating state if this is still the latest request
        const latestRequestId = priceCalculationRefs.current.get(countryCode);
        if (latestRequestId === requestId) {
          setCalculatingPrices((prev) => {
            const next = new Set(prev);
            next.delete(countryCode);
            return next;
          });
        }
      });
  };

  const handleRemoveCountry = (countryCode: string) => {
    const newMap = new Map(selectedCountries);
    newMap.delete(countryCode);
    setSelectedCountries(newMap);
  };

  const handleAddToCart = () => {
    if (selectedCountries.size === 0) {
      toast.error('Vui lòng chọn ít nhất một quốc gia');
      return;
    }

    // Add each selected country as a separate cart item
    const tabKey = getTabKeyFromPlan(plan);
    selectedCountries.forEach((selected) => {
      cart.addToCart(
        tabKey,
        plan,
        selected.quantity,
        {
          duration: duration
        },
        selected.code,
        selected.total
      );
    });

    toast.success(`Đã thêm ${selectedCountries.size} quốc gia vào giỏ hàng`);
    setSelectedCountries(new Map());
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedCountries.forEach((selected) => {
      total += selected.total || 0;
    });
    return total;
  }, [selectedCountries, updateTrigger]);

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

  return (
    <div className="flex gap-5 h-full">
      {/* Left Panel - Selection */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[calc(100dvh-215px)]">
        {/* Error State */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="default" size="sm" onClick={fetchCountries} className="mt-2">
              Thử lại
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Duration Selection */}
            <div>
              <label className="text-text-hi dark:text-text-hi-dark font-medium mb-2 block">Thời hạn:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDuration('7day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    duration === '7day'
                      ? 'bg-primary dark:bg-primary-dark text-white'
                      : 'bg-bg-secondary dark:bg-bg-secondary-dark text-text-me dark:text-text-me-dark hover:bg-bg-mute dark:hover:bg-bg-mute-dark'
                  }`}
                >
                  7 {t('day')}s
                </button>
                <button
                  onClick={() => setDuration('30day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    duration === '30day'
                      ? 'bg-primary dark:bg-primary-dark text-white'
                      : 'bg-bg-secondary dark:bg-bg-secondary-dark text-text-me dark:text-text-me-dark hover:bg-bg-mute dark:hover:bg-bg-mute-dark'
                  }`}
                >
                  30 {t('day')}s
                </button>
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <label className="text-text-hi dark:text-text-hi-dark font-medium mb-2 block">
                Quốc gia: {countryRequired && <span className="text-red-500">*</span>}
              </label>

              {countries.length === 0 ? (
                <div className="p-4 text-center text-text-lo dark:text-text-lo-dark border border-border-element dark:border-border-element-dark rounded-lg">
                  Hiện tại không có quốc gia khả dụng cho gói này
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Asia Countries */}
                  {asiaCountries.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-text-me dark:text-text-me-dark mb-2">Châu Á</h3>
                      <div className="flex flex-wrap gap-3">
                        {asiaCountries.map((country) => {
                          const isSelected = selectedCountries.has(country.code);
                          return (
                            <CountryTag
                              key={country.code}
                              name={getCountryName(country.code)}
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
                      <h3 className="text-sm font-medium text-text-me dark:text-text-me-dark mb-2">Châu Âu</h3>
                      <div className="flex flex-wrap gap-3">
                        {europeCountries.map((country) => {
                          const isSelected = selectedCountries.has(country.code);
                          return (
                            <CountryTag
                              key={country.code}
                              name={getCountryName(country.code)}
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
                      <h3 className="text-sm font-medium text-text-me dark:text-text-me-dark mb-2">Khác</h3>
                      <div className="flex flex-wrap gap-3">
                        {otherCountries.map((country) => {
                          const isSelected = selectedCountries.has(country.code);
                          return (
                            <CountryTag
                              key={country.code}
                              name={getCountryName(country.code)}
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
        )}
      </div>

      {/* Right Panel - Summary */}
      <div className="w-[473px] hidden lg:block border-l border-border-element dark:border-border-element-dark p-5 overflow-y-auto max-h-[calc(100dvh-215px)]">
        <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark mb-4">Tóm tắt đơn hàng</h2>

        {selectedCountries.size === 0 ? (
          <div className="text-center py-8 text-text-lo dark:text-text-lo-dark">Chưa có quốc gia nào được chọn</div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-text-me dark:text-text-me-dark pb-2 border-b border-border-element dark:border-border-element-dark">
              <div className="col-span-4">Country</div>
              <div className="col-span-3 text-right">Giá</div>
              <div className="col-span-3 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Tổng</div>
            </div>

            {/* Selected Countries List */}
            {Array.from(selectedCountries.values()).map((selected) => (
              <div
                key={selected.code}
                className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border-element dark:border-border-element-dark"
              >
                <div className="col-span-4 flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                    alt={selected.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-sm text-text-hi dark:text-text-hi-dark truncate">{selected.name}</span>
                </div>
                <div className="col-span-3 text-right text-sm text-text-me dark:text-text-me-dark">${selected.price.toFixed(2)}</div>
                <div className="col-span-3 flex items-center justify-center gap-1">
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded border border-border-element dark:border-border-element-dark bg-bg-secondary dark:bg-bg-secondary-dark hover:bg-bg-mute dark:hover:bg-bg-mute-dark disabled:opacity-50"
                    onClick={() => handleQuantityChange(selected.code, selected.quantity - 1)}
                    disabled={selected.quantity <= 1}
                    aria-label="Giảm số lượng"
                  >
                    <Subtract className="w-3 h-3 text-text-lo dark:text-text-lo-dark" />
                  </button>
                  <span className="text-sm font-medium text-text-hi dark:text-text-hi-dark min-w-[2rem] text-center">
                    {selected.quantity}
                  </span>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded border border-border-element dark:border-border-element-dark bg-bg-secondary dark:bg-bg-secondary-dark hover:bg-bg-mute dark:hover:bg-bg-mute-dark"
                    onClick={() => handleQuantityChange(selected.code, selected.quantity + 1)}
                    aria-label="Tăng số lượng"
                  >
                    <Add className="w-3 h-3 text-text-lo dark:text-text-lo-dark" />
                  </button>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">${selected.total.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveCountry(selected.code)}
                    className="w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    aria-label="Xóa quốc gia"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                {calculatingPrices.has(selected.code) && (
                  <div className="col-span-12 text-xs text-text-lo dark:text-text-lo-dark animate-pulse">Đang tính giá...</div>
                )}
              </div>
            ))}

            {/* Total */}
            <div className="pt-4 border-t-2 border-border-element dark:border-border-element-dark">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-text-hi dark:text-text-hi-dark">Tổng cộng:</span>
                <span className="text-xl font-bold text-primary dark:text-primary-dark">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4">
              <Button onClick={handleAddToCart} disabled={selectedCountries.size === 0 || loading} className="w-full">
                MUA GÓI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
