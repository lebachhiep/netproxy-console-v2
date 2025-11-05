import { apiService } from '@/services/api/api.service';
import {
  OrderListRequest,
  OrderListResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  OrderWithItems,
} from './order.types';

class OrderService {
  /**
   * Get orders list with filtering support
   * @param params - Filter parameters (type, status, search, date range, pagination)
   * @returns Promise with order items and pagination info
   */
  async getOrders(params?: OrderListRequest): Promise<OrderListResponse> {
    const response = await apiService.get<OrderListResponse>('/user/orders', {
      params,
    });
    return response;
  }

  /**
   * Get single order by ID
   * @param id - Order ID
   * @returns Promise with order details including items
   */
  async getOrderById(id: string): Promise<OrderWithItems> {
    const response = await apiService.get<GetOrderResponse>(`/user/orders/${id}`);
    return response.order; // Unwrap the order from response
  }

  /**
   * Create a new order (purchase)
   * @param request - Order creation request with items and optional coupon
   * @returns Promise with created order details including items
   *
   * @example
   * // Map cart items to order items (for Phase 5 checkout implementation):
   * const items = cartItems.map(item => ({
   *   plan_id: item.plan.id,
   *   quantity: item.quantity,
   *   country: item.country // ISO2 country code (e.g., "US", "GB")
   * }));
   *
   * const order = await orderService.createOrder({
   *   type: 'buy',
   *   items,
   *   coupon_code: cart.couponCode
   * });
   */
  async createOrder(request: CreateOrderRequest): Promise<OrderWithItems> {
    const response = await apiService.post<CreateOrderResponse>('/user/orders', request);
    return response.order; // Unwrap the order from response
  }
}

export const orderService = new OrderService();
