import { apiService } from '@/services/api/api.service';
import { OrderListRequest, OrderListResponse, Order } from './order.types';

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
   * @returns Promise with order details
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await apiService.get<Order>(`/user/orders/${id}`);
    return response;
  }
}

export const orderService = new OrderService();
