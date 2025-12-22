import { useCartContext } from '@/contexts/CartContext';

/**
 * Type-safe hook to access cart context
 *
 * Usage:
 * const { items, addToCart, removeItem, total } = useCart();
 *
 * @throws Error if used outside of CartProvider
 */
export const useCart = () => {
  return useCartContext();
};
