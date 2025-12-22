import React, { useState } from 'react';
import { Button } from '../button/Button';
import { Divider } from '../divider/Divider';
import { Plan } from '@/services/plan/plan.types';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { CountrySelectionModal } from '../modals/CountrySelectionModal';
import { planService } from '@/services/plan/plan.service';
import { getTabKeyFromPlan } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';
interface Feature {
  icon?: React.ReactNode;
  label: React.ReactNode;
}

interface Tag {
  text: string;
  icon?: React.ReactNode;
}

interface PricingCardProps {
  title: string;
  price: string;
  description?: string;
  features: Feature[];
  buttonText: string;
  onClick?: () => void;
  tag?: Tag; // label góc trên (có thể có icon)

  // Cart integration (optional)
  plan?: Plan; // Plan object for cart
  enableCart?: boolean; // Enable cart functionality
  cartOptions?: {
    speedLimit?: string; // for rotating proxies
    staticType?: 'bandwidth' | 'unlimited'; // for static proxies
    duration?: '7day' | '30day'; // for dedicated proxies
  };
  preventNotification?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  onClick,
  tag,
  plan,
  enableCart = false,
  cartOptions,
  preventNotification = false
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cart = enableCart ? useCart() : null;
  const [isAdding, setIsAdding] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const { t } = useTranslation();
  const handleClick = async (e: React.MouseEvent) => {
    // If cart is enabled and plan is provided, add to cart
    if (enableCart && plan && cart) {
      e.stopPropagation();
      setIsAdding(true);

      const tabKey = getTabKeyFromPlan(plan);

      // For rotating plans, skip country selection and add directly to cart
      if (plan.type === 'rotating') {
        cart.addToCart(tabKey, plan, 1, cartOptions);
        if (!preventNotification) {
          toast.success(t('added') + ` "${plan.name}" ` + t('toCard'));
        }
        setIsAdding(false);
        return;
      }

      // For other plan types (dedicated, etc.), check if country selection is needed
      try {
        // Check if country selection is needed
        const countriesData = await planService.getPlanCountries(plan.id);

        if (countriesData.countries.length > 0) {
          // Show country selection modal
          setShowCountryModal(true);
          setIsAdding(false);
        } else {
          // No country selection needed, add directly to cart
          cart.addToCart(tabKey, plan, 1, cartOptions);
          if (!preventNotification) {
            toast.success(t('added') + ` "${plan.name}" ` + t('toCard'));
          }
          setIsAdding(false);
        }
      } catch (error) {
        // If error (e.g., internal plan), add directly to cart
        console.log('Country selection not available, adding directly to cart: ', error);
        cart.addToCart(tabKey, plan, 1, cartOptions);
        if (!preventNotification) {
          toast.success(t('added') + ` "${plan.name}" ` + t('toCard'));
        }
        setIsAdding(false);
      }
    } else if (onClick) {
      // Otherwise use the provided onClick handler
      onClick();
    }
  };

  const handleAddToCartWithCountry = (country: string | undefined, quantity: number, calculatedPrice: number) => {
    if (cart && plan) {
      const tabKey = getTabKeyFromPlan(plan);
      cart.addToCart(tabKey, plan, quantity, cartOptions, country, calculatedPrice);
      if (!preventNotification) {
        toast.success(t('added') + ` "${plan.name}" ` + t('toCard'));
      }
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="group cursor-pointer relative w-full rounded-xl border-2 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark hover:bg-bg-secondary dark:hover:bg-bg-secondary-dark hover:shadow-md shadow-xs p-5 flex flex-col gap-1 transition-all hover:border-blue hover:dark:border-blue-dark"
      >
        {/* Tag */}
        {tag && (
          <span className="absolute -top-3 -left-[2px] flex items-center gap-1 bg-primary dark:bg-primary-dark text-white text-xs font-semibold pl-1 pr-3 py-1 rounded-[50px_100px_100px_0] shadow">
            {tag.icon && <span className="text-sm">{tag.icon}</span>}
            {tag.text.toLowerCase() === 'popular' ? t('popular') : tag.text}
          </span>
        )}

        <div className="flex flex-col gap-4 text-text-me dark:text-text-me-dark group-hover:text-text-hi group-hover:dark:text-text-hi-dark">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark font-averta">{title}</h3>
            <div className="flex items-start gap-[2px] font-averta">
              <span className="text-green dark:text-green-dark font-semibold text-[12px] tracking-[-0.66px]">$</span>
              <span className="text-blue dark:text-blue-dark font-semibold text-lg">{price}</span>
            </div>
          </div>

          <Divider />

          {description && (
            <>
              <p className="text-sm text-text-me dark:text-text-me-dark line-clamp-2">{description}</p>
              <Divider />
            </>
          )}

          {/* Features */}
          <ul className="flex flex-col gap-4 text-sm">
            {features.map((f, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {f.icon}
                <span>{f.label}</span>
              </li>
            ))}
          </ul>

          <Divider />

          {/* Button */}
          <Button
            onClick={handleClick}
            loading={isAdding}
            disabled={isAdding}
            className="h-10 group-hover:bg-primary group-hover:dark:bg-primary-dark group-hover:border-primary-border group-hover:dark:border-primary-border-dark group-hover:text-white"
            variant="default"
          >
            {buttonText}
          </Button>
        </div>
      </div>

      {/* Country Selection Modal */}
      {plan && (
        <CountrySelectionModal
          open={showCountryModal}
          plan={plan}
          onClose={() => setShowCountryModal(false)}
          onAddToCart={handleAddToCartWithCountry}
          cartOptions={cartOptions}
        />
      )}
    </>
  );
};
