import React, { useState, useEffect } from 'react';
import { Modal } from '../modal/Modal';
import { CountryTag } from '../tag/CountryTag';
import { Button } from '../button/Button';
import { Add, Subtract } from '../icons';
import { Plan } from '@/services/plan/plan.types';
import { planService } from '@/services/plan/plan.service';
import { toast } from 'sonner';
import { Country } from '@/services/plan/plan.types';
import countriesLib from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import vi from 'i18n-iso-countries/langs/vi.json';
import { useTranslation } from 'react-i18next';
// Register locales
countriesLib.registerLocale(en);
countriesLib.registerLocale(vi);

// Helper function to get country name from code in Vietnamese
const getCountryName = (code: string): string => {
  return countriesLib.getName(code, 'vi', { select: 'official' }) || countriesLib.getName(code, 'en', { select: 'official' }) || code;
};

interface CountrySelectionModalProps {
  open: boolean;
  plan: Plan;
  onClose: () => void;
  onAddToCart: (country: string | undefined, quantity: number, calculatedPrice: number) => void;
  cartOptions?: {
    speedLimit?: string;
    staticType?: 'bandwidth' | 'unlimited';
    duration?: '7day' | '30day';
  };
}

export const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({ open, plan, onClose, onAddToCart }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(plan.price);
  const [isCalculating, setIsCalculating] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryRequired, setCountryRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  // Fetch countries on mount
  useEffect(() => {
    if (open) {
      fetchCountries();
    }
  }, [open, plan.id]);

  // Calculate price when country or quantity changes (but only after countries are loaded)
  useEffect(() => {
    if (open && !loading && (selectedCountry || !countryRequired)) {
      calculatePrice();
    }
  }, [selectedCountry, quantity, open, loading, countryRequired]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await planService.getPlanCountries(plan.id);

      // Filter out unavailable countries
      const availableCountries = response.countries.filter((c) => c.available);
      setCountries(availableCountries);
      setCountryRequired(response.country_required);

      // If country is not required, set selectedCountry to undefined (means "Any Country")
      if (!response.country_required && availableCountries.length > 0) {
        setSelectedCountry(undefined);
      }
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Không thể tải danh sách quốc gia');
      toast.error(t('toast.error.countryList'));
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    try {
      setIsCalculating(true);
      const response = await planService.calculatePlanPrice(plan.id, {
        country: selectedCountry
      });
      setCalculatedPrice(response.price);
    } catch (err) {
      console.error('Failed to calculate price:', err);
      // Fallback to base price * quantity
      setCalculatedPrice(plan.price * quantity);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleSelectAnyCountry = () => {
    setSelectedCountry(undefined);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Validate: if country is required, must select one
    if (countryRequired && !selectedCountry) {
      toast.error(t('toast.warn.pickCountry'));
      return;
    }

    onAddToCart(selectedCountry, quantity, calculatedPrice);
    onClose();
  };

  const canAddToCart = !countryRequired || selectedCountry !== undefined;

  return (
    <Modal
      open={open}
      title={t('pickCountry') + ` - ${plan.name}`}
      onClose={onClose}
      className="max-w-2xl"
      bodyClassName="p-5"
      footerClassName="p-5"
      cancelButton={
        <Button variant="default" onClick={onClose}>
          {t('cancel').toUpperCase()}
        </Button>
      }
      actions={[
        <Button key="add" onClick={handleAddToCart} disabled={!canAddToCart || loading} loading={isCalculating}>
          {t('addToCard')}
        </Button>
      ]}
    >
      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <Button variant="default" size="sm" onClick={fetchCountries} className="mt-2">
            {t('retry')}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark"></div>
        </div>
      ) : (
        <>
          {/* Base Price */}
          <div className="mb-4">
            <span className="text-text-lo dark:text-text-lo-dark text-sm">{t('basePrice')}: </span>
            <span className="text-text-hi dark:text-text-hi-dark font-semibold text-lg">${plan.price.toFixed(2)}</span>
          </div>

          {/* Country Selection */}
          <div className="mb-4">
            <label className="text-text-hi dark:text-text-hi-dark font-medium mb-2 block">
              {t('Country')}: {countryRequired && <span className="text-red-500">*</span>}
            </label>

            {countries.length === 0 ? (
              <div className="p-4 text-center text-text-lo dark:text-text-lo-dark border border-border-element dark:border-border-element-dark rounded-lg">
                {t('noAvaiCountry')}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto p-4 border border-border-element dark:border-border-element-dark rounded-lg">
                {/* "Any Country" option for optional plans */}
                {!countryRequired && (
                  <div
                    onClick={handleSelectAnyCountry}
                    className={`inline-flex shadow-xs text-sm items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] cursor-pointer transition
                      ${!selectedCountry ? 'bg-primary dark:bg-primary-dark text-white border-primary-border dark:border-primary-border-dark font-bold' : 'bg-bg-primary dark:bg-bg-primary-dark text-text-me dark:text-text-me-dark font-medium border-border-element dark:border-border-element-dark hover:bg-gray-200'}
                    `}
                  >
                    <span>🌐</span>
                    <span>{t('anyCountry')}</span>
                  </div>
                )}

                {/* Country list */}
                {countries.map((country) => (
                  <CountryTag
                    key={country.code}
                    name={getCountryName(country.code)}
                    flagUrl={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    active={selectedCountry === country.code}
                    onClick={() => handleCountrySelect(country.code)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="text-text-hi dark:text-text-hi-dark font-medium mb-2 block">{t('quantity')}:</label>
            <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] rounded-md w-32">
              <button
                className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-8 h-8 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                onClick={() => handleQuantityChange(quantity - 1)}
                aria-label="Giảm số lượng"
                disabled={quantity <= 1}
              >
                <Subtract className="text-text-lo dark:text-text-lo-dark" aria-hidden="true" />
              </button>
              <span className="text-text-hi dark:text-text-hi-dark font-medium" aria-label={t('quantity') + `: ${quantity}`}>
                {quantity}
              </span>
              <button
                className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-8 h-8 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                onClick={() => handleQuantityChange(quantity + 1)}
                aria-label="Tăng số lượng"
              >
                <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="pt-4 border-t border-border-element dark:border-border-element-dark">
            <span className="text-text-lo dark:text-text-lo-dark text-sm">{t('sumPrice')}: </span>
            <span className="text-primary dark:text-primary-dark font-bold text-2xl">${calculatedPrice.toFixed(2)}</span>
            {isCalculating && (
              <span className="ml-2 text-text-lo dark:text-text-lo-dark text-sm animate-pulse">({t('calculating')}...)</span>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
