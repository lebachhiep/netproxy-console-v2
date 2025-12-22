import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plan } from '@/services/plan/plan.types';
import { useAuthStore } from '@/stores/auth.store';

// Tab keys for organizing cart items
export type CartTabKey = 'rotating' | 'premium_isp' | 'private_ipv4' | 'shared_ipv4' | 'ipv6' | 'static';

// Cart item structure
export interface CartItem {
  id: string; // unique cart item ID
  plan: Plan; // full plan object
  quantity: number;
  country?: string; // ISO2 country code (e.g., "US", "GB")
  duration?: '7day' | '30day'; // for dedicated proxies
  speedLimit?: string; // for rotating (5mbps, 10mbps, 25mbps, 50mbps)
  staticType?: 'bandwidth' | 'unlimited'; // for static proxies
  calculatedPrice?: number; // for external provider plans with dynamic pricing
  quantityBoundary?: {
    min: number;
    max?: number;
  };
}

// Cart items organized by tab
export interface CartItemsByTab {
  rotating: CartItem[];
  premium_isp: CartItem[];
  private_ipv4: CartItem[];
  shared_ipv4: CartItem[];
  ipv6: CartItem[];
  static: CartItem[];
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
  itemsByTab: CartItemsByTab;
  couponCode?: string;
  validatedCoupon?: CouponData;
  discountAmount: number;

  // Computed values
  subtotal: number;
  total: number;
  itemCount: number;

  // Helper to get items from specific tab
  getTabItems: (tabKey: CartTabKey) => CartItem[];
  // Helper to get all items as flat array (for backward compatibility)
  getAllItems: () => CartItem[];

  // Actions
  addToCart: (
    tabKey: CartTabKey,
    plan: Plan,
    quantity: number,
    options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>,
    country?: string,
    calculatedPrice?: number,
    quantityBoundary?: {
      min: number;
      max?: number;
    }
  ) => void;
  removeItem: (tabKey: CartTabKey, itemId: string) => void;
  updateQuantity: (tabKey: CartTabKey, itemId: string, quantity: number) => void;
  updateCartItem: (tabKey: CartTabKey, itemId: string, quantity: number, calculatedPrice?: number) => void;
  updateCountry: (tabKey: CartTabKey, itemId: string, country: string) => void;
  clearCart: () => void;
  clearTabCart: (tabKey: CartTabKey) => void;
  clearCartByItemIds: (tabKey: CartTabKey, itemIds: string[]) => void;
  applyCoupon: (code: string, couponData: CouponData, discount: number) => void;
  removeCoupon: () => void;
  getItemByPlan: (
    tabKey: CartTabKey,
    planId: string,
    options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>
  ) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'netproxy-cart';

interface CartProviderProps {
  children: ReactNode;
}

// Helper to create empty cart structure
const createEmptyCart = (): CartItemsByTab => ({
  rotating: [],
  premium_isp: [],
  private_ipv4: [],
  shared_ipv4: [],
  ipv6: [],
  static: []
});

// Helper to determine tab key from plan metadata
const getTabKeyFromPlan = (plan: Plan): CartTabKey => {
  if (plan.type === 'rotating') return 'rotating';
  if (plan.type === 'static') return 'static';

  // For dedicated plans, use metadata.proxy_type to determine tab
  const proxyType = plan.metadata?.proxy_type;
  if (proxyType === 'Premium (ISP)' || proxyType === 'Premium ISP') return 'premium_isp';
  if (proxyType === 'Private IPv4') return 'private_ipv4';
  if (proxyType === 'Shared IPv4') return 'shared_ipv4';
  if (proxyType === 'IPv6') return 'ipv6';

  // Default fallback based on plan type
  return 'private_ipv4'; // Default for dedicated
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [itemsByTab, setItemsByTab] = useState<CartItemsByTab>(createEmptyCart());
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [validatedCoupon, setValidatedCoupon] = useState<CouponData | undefined>();
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Get user from auth store to detect login/logout
  const user = useAuthStore((state) => state.user);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Handle both old format (items array) and new format (itemsByTab object)
        if (parsed.itemsByTab) {
          // New format
          setItemsByTab(parsed.itemsByTab);
        } else if (parsed.items && Array.isArray(parsed.items)) {
          // Old format - migrate to new format
          const migratedCart = createEmptyCart();
          parsed.items.forEach((item: CartItem) => {
            const tabKey = getTabKeyFromPlan(item.plan);
            migratedCart[tabKey].push(item);
          });
          setItemsByTab(migratedCart);
        }

        if (parsed.couponCode) setCouponCode(parsed.couponCode);
        if (parsed.validatedCoupon) setValidatedCoupon(parsed.validatedCoupon);
        if (parsed.discountAmount) setDiscountAmount(parsed.discountAmount);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Clear cart when user logs in or logs out (auth state changes)
  useEffect(() => {
    // Clear cart on auth change (login/logout)
    setItemsByTab(createEmptyCart());
    setCouponCode(undefined);
    setValidatedCoupon(undefined);
    setDiscountAmount(0);
  }, [user?.user_id]); // Only trigger when user ID changes (login/logout)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const toSave = {
        itemsByTab,
        couponCode,
        validatedCoupon,
        discountAmount
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [itemsByTab, couponCode, validatedCoupon, discountAmount]);

  // Helper to get all items as flat array
  const getAllItems = (): CartItem[] => {
    return Object.values(itemsByTab).flat();
  };

  // Helper to get items from specific tab
  const getTabItems = (tabKey: CartTabKey): CartItem[] => {
    return itemsByTab[tabKey] || [];
  };

  // Computed values
  const allItems = getAllItems();
  const subtotal = allItems.reduce((sum, item) => {
    // Use calculatedPrice if available (for external provider plans), otherwise use plan.price
    const itemPrice = item.calculatedPrice ?? item.plan.price;
    return sum + itemPrice * item.quantity;
  }, 0);
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = allItems.reduce((sum, item) => sum + item.quantity, 0);

  // Helper function to generate unique cart item ID
  const generateItemId = (plan: Plan, options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>, country?: string): string => {
    const parts = [plan.id];
    if (country) parts.push(country);
    if (options?.duration) parts.push(options.duration);
    if (options?.speedLimit) parts.push(options.speedLimit);
    if (options?.staticType) parts.push(options.staticType);
    return parts.join('-');
  };

  // Get item by plan ID and options from specific tab
  const getItemByPlan = (
    tabKey: CartTabKey,
    planId: string,
    options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>
  ): CartItem | undefined => {
    const tabItems = itemsByTab[tabKey];
    return tabItems.find((item) => {
      if (item.plan.id !== planId) return false;

      // Check if options match
      if (options?.country && item.country !== options.country) return false;
      if (options?.duration && item.duration !== options.duration) return false;
      if (options?.speedLimit && item.speedLimit !== options.speedLimit) return false;
      if (options?.staticType && item.staticType !== options.staticType) return false;

      return true;
    });
  };

  // Add item to cart (or update quantity if exists)
  const addToCart = (
    tabKey: CartTabKey,
    plan: Plan,
    quantity: number,
    options?: Partial<Omit<CartItem, 'id' | 'plan' | 'quantity'>>,
    country?: string,
    calculatedPrice?: number,
    quantityBoundary?: {
      min: number;
      max?: number;
    }
  ) => {
    if (quantity < 1) return;

    const itemId = generateItemId(plan, options, country);
    const tabItems = itemsByTab[tabKey];
    const existingItem = tabItems.find((item) => item.id === itemId);
    if (existingItem) {
      // Update existing item quantity
      setItemsByTab({
        ...itemsByTab,
        [tabKey]: tabItems.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item))
      });
    } else {
      // Add new item
      const newItem: CartItem = {
        id: itemId,
        plan,
        quantity,
        country,
        calculatedPrice,
        quantityBoundary,
        ...options
      };
      setItemsByTab({
        ...itemsByTab,
        [tabKey]: [...tabItems, newItem]
      });
    }
  };

  // Remove item from cart
  const removeItem = (tabKey: CartTabKey, itemId: string) => {
    const tabItems = itemsByTab[tabKey];
    setItemsByTab({
      ...itemsByTab,
      [tabKey]: tabItems.filter((item) => item.id !== itemId)
    });
  };

  // Update item quantity
  const updateQuantity = (tabKey: CartTabKey, itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(tabKey, itemId);
      return;
    }

    const tabItems = itemsByTab[tabKey];
    setItemsByTab({
      ...itemsByTab,
      [tabKey]: tabItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    });
  };

  // Update item quantity and calculatedPrice atomically
  const updateCartItem = (tabKey: CartTabKey, itemId: string, quantity: number, calculatedPrice?: number) => {
    if (quantity < 1) {
      removeItem(tabKey, itemId);
      return;
    }

    const tabItems = itemsByTab[tabKey];
    setItemsByTab({
      ...itemsByTab,
      [tabKey]: tabItems.map((item) =>
        item.id === itemId ? { ...item, quantity, ...(calculatedPrice !== undefined && { calculatedPrice }) } : item
      )
    });
  };

  // Update item country
  const updateCountry = (tabKey: CartTabKey, itemId: string, country: string) => {
    const tabItems = itemsByTab[tabKey];
    setItemsByTab({
      ...itemsByTab,
      [tabKey]: tabItems.map((item) => (item.id === itemId ? { ...item, country } : item))
    });
  };

  // Clear all items from cart (all tabs)
  const clearCart = () => {
    setItemsByTab(createEmptyCart());
    setCouponCode(undefined);
    setValidatedCoupon(undefined);
    setDiscountAmount(0);
  };

  // Clear items from specific tab
  const clearTabCart = (tabKey: CartTabKey) => {
    setItemsByTab({
      ...itemsByTab,
      [tabKey]: []
    });

    // If all items are cleared, also clear coupon
    const remainingItems = Object.entries(itemsByTab)
      .filter(([key]) => key !== tabKey)
      .flatMap(([, items]) => items);

    if (remainingItems.length === 0) {
      setCouponCode(undefined);
      setValidatedCoupon(undefined);
      setDiscountAmount(0);
    }
  };

  // Clear cart by item IDs (for clearing only specific items after checkout)
  const clearCartByItemIds = (tabKey: CartTabKey, itemIds: string[]) => {
    const tabItems = itemsByTab[tabKey];
    const updatedTabItems = tabItems.filter((item) => !itemIds.includes(item.id));

    setItemsByTab({
      ...itemsByTab,
      [tabKey]: updatedTabItems
    });

    // If all items are cleared, also clear coupon
    const allRemainingItems = Object.entries({
      ...itemsByTab,
      [tabKey]: updatedTabItems
    }).flatMap(([, items]) => items);

    if (allRemainingItems.length === 0) {
      setCouponCode(undefined);
      setValidatedCoupon(undefined);
      setDiscountAmount(0);
    }
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
    itemsByTab,
    couponCode,
    validatedCoupon,
    discountAmount,
    subtotal,
    total,
    itemCount,
    getTabItems,
    getAllItems,
    addToCart,
    removeItem,
    updateQuantity,
    updateCartItem,
    updateCountry,
    clearCart,
    clearTabCart,
    clearCartByItemIds,
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

// Export helper function to determine tab key from plan (for use in components)
export { getTabKeyFromPlan };
