import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plan } from '@/services/plan/plan.types';
import { Country } from '@/pages/purchase/components/table/CountrySelector';

// Cart item structure
export interface CartItem {
  id: string; // unique cart item ID
  plan: Plan; // full plan object
  quantity: number;
  country?: Country; // for dedicated proxies
  duration?: '7day' | '30day'; // for dedicated proxies
  speedLimit?: string; // for rotating (5mbps, 10mbps, 25mbps, 50mbps)
  staticType?: 'bandwidth' | 'unlimited'; // for static proxies
}

// Coupon data structure
export interface CouponData {
  id: string;
  code: string;
  type: string; // "percentage" or "fixed"
  discount: number; // Percentage (e.g., 10 for 10%) or fixed amount
  currency_code: string;
  description?: string;
  reseller_id?: string;
  expires_at: string;
}

interface CartContextType {
  items: CartItem[];
  couponCode?: string;
  validatedCoupon?: CouponData;
  discountAmount: number;

  // Computed values
  subtotal: number;
  total: number;
  itemCount: number;

  // Actions
  addToCart: (plan: Plan, quantity: number, options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCountry: (itemId: string, country: Country) => void;
  clearCart: () => void;
  applyCoupon: (code: string, couponData: CouponData, discount: number) => void;
  removeCoupon: () => void;
  getItemByPlan: (planId: string, options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'netproxy-cart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [validatedCoupon, setValidatedCoupon] = useState<CouponData | undefined>();
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.items) setItems(parsed.items);
        if (parsed.couponCode) setCouponCode(parsed.couponCode);
        if (parsed.validatedCoupon) setValidatedCoupon(parsed.validatedCoupon);
        if (parsed.discountAmount) setDiscountAmount(parsed.discountAmount);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const toSave = {
        items,
        couponCode,
        validatedCoupon,
        discountAmount
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items, couponCode, validatedCoupon, discountAmount]);

  // Computed values
  const subtotal = items.reduce((sum, item) => sum + item.plan.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Helper function to generate unique cart item ID
  const generateItemId = (plan: Plan, options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>): string => {
    const parts = [plan.id];
    if (options?.country) parts.push(options.country.code);
    if (options?.duration) parts.push(options.duration);
    if (options?.speedLimit) parts.push(options.speedLimit);
    if (options?.staticType) parts.push(options.staticType);
    return parts.join('-');
  };

  // Get item by plan ID and options
  const getItemByPlan = (planId: string, options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>): CartItem | undefined => {
    return items.find(item => {
      if (item.plan.id !== planId) return false;

      // Check if options match
      if (options?.country && item.country?.code !== options.country.code) return false;
      if (options?.duration && item.duration !== options.duration) return false;
      if (options?.speedLimit && item.speedLimit !== options.speedLimit) return false;
      if (options?.staticType && item.staticType !== options.staticType) return false;

      return true;
    });
  };

  // Add item to cart (or update quantity if exists)
  const addToCart = (plan: Plan, quantity: number, options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>) => {
    if (quantity < 1) return;

    const itemId = generateItemId(plan, options);
    const existingItem = items.find(item => item.id === itemId);

    if (existingItem) {
      // Update existing item quantity
      setItems(items.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Add new item
      const newItem: CartItem = {
        id: itemId,
        plan,
        quantity,
        ...options
      };
      setItems([...items, newItem]);
    }
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setItems(items.map(item =>
      item.id === itemId
        ? { ...item, quantity }
        : item
    ));
  };

  // Update item country (for dedicated proxies)
  const updateCountry = (itemId: string, country: Country) => {
    setItems(items.map(item =>
      item.id === itemId
        ? { ...item, country }
        : item
    ));
  };

  // Clear all items from cart
  const clearCart = () => {
    setItems([]);
    setCouponCode(undefined);
    setValidatedCoupon(undefined);
    setDiscountAmount(0);
  };

  // Apply coupon
  const applyCoupon = (code: string, couponData: CouponData, discount: number) => {
    setCouponCode(code);
    setValidatedCoupon(couponData);
    setDiscountAmount(discount);
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponCode(undefined);
    setValidatedCoupon(undefined);
    setDiscountAmount(0);
  };

  const value: CartContextType = {
    items,
    couponCode,
    validatedCoupon,
    discountAmount,
    subtotal,
    total,
    itemCount,
    addToCart,
    removeItem,
    updateQuantity,
    updateCountry,
    clearCart,
    applyCoupon,
    removeCoupon,
    getItemByPlan
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
