import React, { useRef, useState } from 'react';
import { Country } from './table/CountrySelector';
import { Add, CartFilled, Delete, Subtract } from '@/components/icons';
import IconButton from '@/components/button/IconButton';
import { useCart } from '@/hooks/useCart';
import { CartItem, getTabKeyFromPlan } from '@/contexts/CartContext';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import vi from 'i18n-iso-countries/langs/vi.json';
import { RotateDesktopSummary } from './RotateDesktopSummary';
import { toast } from 'sonner';
import clsx from 'clsx';
import { t } from 'i18next';

// Register locales
countries.registerLocale(en);
countries.registerLocale(vi);

export type OrderItemType = {
  country: Country;
  price: number;
  quantity: number;
};

interface Props {
  orders?: OrderItemType[]; // Optional for backward compatibility
  onUpdateQuantity?: (country: Country, quantity: number) => void;
  onRemove?: (country: Country) => void;
  useCartContext?: boolean; // Flag to use cart context instead of props
  proxyType?: string; // Proxy type for dedicated tabs (e.g., "Premium ISP", "Private IPv4")
  duration?: number; // Duration in days (e.g., 7, 30)
  filterPlanType?: 'rotating' | 'dedicated' | 'static'; // Filter cart items by plan type
  handleCloseModal?: () => void;
}

const RotateOrderSummary: React.FC<Props> = ({
  orders: propOrders = [],
  onUpdateQuantity,
  onRemove,
  useCartContext = false,
  proxyType,
  duration,
  filterPlanType,
  handleCloseModal
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cart = useCartContext ? useCart() : null;
  const updatingItemsRef = useRef<Set<string>>(new Set()); // Track items being updated
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // Track which item is being edited
  const [editValue, setEditValue] = useState<string>(''); // Value being edited

  // Use cart context if flag is set, otherwise use props
  // Filter cart items by plan type if filterPlanType is provided
  // If propOrders is provided, use it (for dedicated tabs with filtered items)
  let orders: any[];
  if (useCartContext && cart) {
    if (propOrders.length > 0) {
      // If propOrders is provided, use it (for dedicated tabs)
      orders = propOrders;
    } else if (filterPlanType) {
      const allItems = cart.getAllItems();
      orders = allItems.filter((item) => item.plan.type === filterPlanType);
    } else {
      orders = cart.getAllItems();
    }
  } else {
    orders = propOrders;
  }
  const isEmpty = orders.length === 0;

  // Nếu giỏ hàng trống
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center  bg-bg-canvas dark:bg-bg-canvas-dark border-l-2 border-border-element dark:border-border-element-dark text-center p-8">
        <CartFilled className="w-16 h-16 text-text-lo dark:text-text-lo-dark mb-4 opacity-70" />
        <h2 className="text-text-hi dark:text-text-hi-dark font-semibold text-lg mb-2">{t('emptyCard')}</h2>
        <p className="text-text-me dark:text-text-me-dark text-sm mb-6">
          {useCartContext ? 'Hãy chọn gói dịch vụ để thêm vào giỏ hàng.' : 'Hãy chọn quốc gia để thêm IP vào giỏ hàng của bạn.'}
        </p>
      </div>
    );
  }

  // Calculate totals based on cart type
  let total: number;
  let totalIps: number;
  let totalLocation: number;

  if (useCartContext && cart) {
    // For cart context items - use filtered items if filterPlanType is provided or if propOrders is provided
    let filteredItems;
    if (propOrders.length > 0) {
      // If propOrders is provided (for dedicated tabs), calculate from orders
      // We need to map back to cart items to get calculatedPrice
      const allItems = cart.getAllItems();
      filteredItems = orders
        .map((orderItem) => {
          // Find corresponding cart item
          const cartItem = allItems.find((item) => {
            if (orderItem.country) {
              return item.country?.toLowerCase() === orderItem.country.code;
            }
            return false;
          });
          return cartItem;
        })
        .filter(Boolean) as any[];

      // If we can't find cart items, calculate from orderItems directly
      if (filteredItems.length === 0) {
        total = (propOrders as OrderItemType[]).reduce((sum, o) => sum + o.price * o.quantity, 0);
        totalIps = (propOrders as OrderItemType[]).reduce((sum, o) => sum + o.quantity, 0);
        totalLocation = (propOrders as OrderItemType[]).length;
      } else {
        total = filteredItems.reduce((sum, item) => {
          const itemPrice = item.calculatedPrice ?? item.plan.price * item.quantity;
          return sum + itemPrice;
        }, 0);
        totalIps = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
        totalLocation = filteredItems.length;
      }
    } else {
      const allItems = cart.getAllItems();
      filteredItems = filterPlanType ? allItems.filter((item) => item.plan.type === filterPlanType) : allItems;

      total = filteredItems.reduce((sum, item) => {
        const itemPrice = item.calculatedPrice ?? item.plan.price * item.quantity;
        return sum + itemPrice;
      }, 0);
      totalIps = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      totalLocation = filteredItems.length;
    }
  } else {
    // For dedicated orders (backward compatibility)
    const orderItems = propOrders as OrderItemType[];
    total = orderItems.reduce((sum, o) => sum + o.price * o.quantity, 0);
    totalIps = orderItems.reduce((sum, o) => sum + o.quantity, 0);
    totalLocation = orderItems.length;
  }

  // Handle quantity update
  const handleUpdateQuantity = (itemOrCountry: CartItem | Country, newQuantity: number) => {
    if (useCartContext && cart) {
      const item = itemOrCountry as CartItem;

      // Prevent multiple simultaneous updates for the same item
      if (updatingItemsRef.current.has(item.id)) {
        return;
      }

      // Ensure quantity is valid
      if (newQuantity < 1) {
        // Determine tabKey from item's plan
        const tabKey = getTabKeyFromPlan(item.plan);
        cart.removeItem(tabKey, item.id);
        return;
      }

      // Mark as updating
      updatingItemsRef.current.add(item.id);

      // Determine tabKey from item's plan
      const tabKey = getTabKeyFromPlan(item.plan);
      // Use updateQuantity to set the exact quantity (not add/subtract)
      cart.updateQuantity(tabKey, item.id, newQuantity);

      // Clear updating flag after a short delay
      setTimeout(() => {
        updatingItemsRef.current.delete(item.id);
      }, 100);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(itemOrCountry as Country, newQuantity);
    }
  };

  // Handle double click to edit quantity
  const handleClickQuantity = (item: CartItem) => {
    if (useCartContext && cart) {
      setEditingItemId(item.id);
      setEditValue(item.quantity.toString());
    }
  };

  // Handle quantity input change
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setEditValue(value);
    }
  };

  // Handle quantity input blur/enter
  const handleQuantityInputBlur = () => {
    if (!editingItemId || !useCartContext || !cart) return;

    const quantity = parseInt(editValue, 10);
    if (!isNaN(quantity) && quantity >= 1) {
      const allItems = cart.getAllItems();
      const item = allItems.find((i) => i.id === editingItemId);
      if (item) {
        handleUpdateQuantity(item, quantity);
      }
    }

    setEditingItemId(null);
    setEditValue('');
  };

  // Handle quantity input key press
  const handleQuantityInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuantityInputBlur();
    } else if (e.key === 'Escape') {
      setEditingItemId(null);
      setEditValue('');
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className=" flex flex-col h-full flex-1">
        {/* Scrollable order list */}
        <div className="px-5 pt-5 flex-1 h-full">
          <div className="flex-1 flex flex-col overflow-visible  rounded-xl shadow-xs text-sm sticky bottom-5 bg-bg-canvas dark:dark:bg-bg-primary-dark border border-border-element dark:border-border-element-dark">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-5 text-sm font-medium text-text-lo dark:text-text-lo-dark border-b border-border-element dark:border-border-element-dark p-2">
              <span className="w-full text-start">{t('price')}</span>
              <span className="w-full text-center">{t('quantity')}</span>
              <span className="text-end w-full">{t('totalPrice')}</span>
            </div>

            {/* List items */}
            <div className="space-y-3 overflow-y-auto flex-1 p-2">
              {useCartContext && cart
                ? // Render cart items (already filtered by filterPlanType if provided)
                  // Check if orders are CartItems or OrderItemTypes
                  orders.map((item: any) => {
                    // If item has 'plan' property, it's a CartItem
                    // If item has 'country' property, it's an OrderItemType
                    const isCartItem = 'plan' in item;

                    if (isCartItem) {
                      // Render as CartItem
                      return (
                        <div key={item.id} className="grid grid-cols-[1fr_1fr_1fr] gap-5 text-sm font-medium items-center">
                          {/* Đơn giá */}
                          <div className="text-star text-primary dark:text-primary-dark font-semibold">
                            ${(item.calculatedPrice ?? item.plan.price).toFixed(2)}
                          </div>

                          {/* Số lượng */}
                          <div className="w-[100px] mx-auto">
                            <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] dark:border-border-element-dark rounded-md">
                              <div
                                role="button"
                                className={clsx(
                                  'shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent',
                                  {
                                    'opacity-50 cursor-not-allowed pointer-events-none': item.quantity <= 1
                                  }
                                )}
                                onClick={() => {
                                  if (item.quantity <= 1) {
                                    toast.error(t('toast.success.minAmount'));
                                    return;
                                  }
                                  handleUpdateQuantity(item, item.quantity - 1);
                                }}
                              >
                                <Subtract className="text-text-lo dark:text-text-lo-dark " />
                              </div>
                              {editingItemId === item.id ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={handleQuantityInputChange}
                                  onBlur={handleQuantityInputBlur}
                                  onKeyDown={handleQuantityInputKeyPress}
                                  className="max-w-10 text-center text-text-hi dark:text-text-hi-dark bg-bg-primary dark:bg-bg-primary-dark border border-primary dark:border-primary-dark rounded px-1 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="text-text-hi dark:text-text-hi-dark cursor-pointer select-none px-2"
                                  onClick={() => handleClickQuantity(item)}
                                  title="Click để chỉnh sửa"
                                >
                                  {item.quantity}
                                </span>
                              )}
                              <div
                                className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              >
                                <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4 " />
                              </div>
                            </div>
                          </div>

                          {/* Tổng */}
                          <div className="text-end text-text-hi dark:text-text-hi-dark w-full select-none">
                            ${((item.calculatedPrice ?? item.plan.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    } else {
                      // Render as OrderItemType (for dedicated tabs)
                      const orderItem = item as OrderItemType;
                      return (
                        <div
                          key={orderItem.country.id}
                          className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 text-sm font-medium items-center border-b border-border-element dark:border-border-element-dark pb-2"
                        >
                          {/* Quốc gia */}
                          <div className="text-text-hi dark:text-text-hi-dark">{orderItem.country.name}</div>

                          {/* Đơn giá */}
                          <div className="w-[42px] text-center text-primary dark:text-primary-dark font-semibold">
                            ${orderItem.price.toFixed(2)}
                          </div>

                          {/* Số lượng */}
                          <div className="w-[100px]">
                            <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] dark:border-border-element-dark rounded-md">
                              <div
                                className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                                onClick={() => onUpdateQuantity && onUpdateQuantity(orderItem.country, orderItem.quantity - 1)}
                              >
                                <Subtract className="text-text-lo dark:text-text-lo-dark " />
                              </div>
                              <span className="text-text-hi dark:text-text-hi-dark">{orderItem.quantity}</span>
                              <div
                                className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                                onClick={() => onUpdateQuantity && onUpdateQuantity(orderItem.country, orderItem.quantity + 1)}
                              >
                                <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4 " />
                              </div>
                            </div>
                          </div>

                          {/* Tổng */}
                          <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">
                            ${(orderItem.price * orderItem.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    }
                  })
                : // Render dedicated orders (backward compatibility)
                  propOrders.map((o) => (
                    <div
                      key={o.country.id}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-5 text-sm font-medium items-center border-b border-border-element dark:border-border-element-dark pb-2"
                    >
                      {/* Quốc gia */}
                      <div className="text-text-hi dark:text-text-hi-dark">{o.country.name}</div>

                      {/* Đơn giá */}
                      <div className="w-[42px] text-center text-primary dark:text-primary-dark font-semibold">${o.price.toFixed(2)}</div>

                      {/* Số lượng */}
                      <div className="w-[100px]">
                        <div className="bg-bg-mute dark:bg-bg-mute-dark flex items-center gap-1 justify-between p-[2px] dark:border-border-element-dark rounded-md">
                          <div
                            className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(o.country, o.quantity - 1)}
                          >
                            <Subtract className="text-text-lo dark:text-text-lo-dark " />
                          </div>
                          <span className="text-text-hi dark:text-text-hi-dark">{o.quantity}</span>
                          <div
                            className="shadow-xs bg-bg-secondary dark:bg-bg-secondary-dark w-6 h-6 flex items-center justify-center rounded-[4px] border-2 border-border-element dark:border-border-element-dark cursor-pointer dark:pseudo-border-top dark:border-transparent"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(o.country, o.quantity + 1)}
                          >
                            <Add className="text-text-lo dark:text-text-lo-dark w-4 h-4 " />
                          </div>
                        </div>
                      </div>

                      {/* Tổng */}
                      <div className="w-[60px] text-center text-text-hi dark:text-text-hi-dark">${(o.price * o.quantity).toFixed(2)}</div>

                      {/* Nút xóa */}
                      <IconButton
                        className="w-8 h-8"
                        icon={<Delete className="w-5 h-5" />}
                        onClick={() => onRemove && onRemove(o.country)}
                        aria-label="Xóa khỏi giỏ hàng"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <RotateDesktopSummary
          orders={propOrders}
          total={total}
          totalIps={totalIps}
          totalLocation={totalLocation}
          useCartContext={useCartContext}
          proxyType={proxyType}
          duration={duration}
          filterPlanType={filterPlanType}
          orderCallback={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default RotateOrderSummary;
