import { apiService } from '@/services/api/api.service';
import {
  ListSubscriptionsResponse,
  ListSubscriptionsRequest,
  UpdateAutoRenewRequest,
  SubscriptionWithPlan,
  OrderSubscriptionsResponse,
  SwitchProtocolRequest,
  SwitchProtocolResponse,
  ListOrderSubscriptionsRequest
} from '@/types/subscription';

class SubscriptionService {
  private readonly BASE_PATH = '/user/subscriptions';

  /**
   * Get list of subscriptions
   * @param params - Optional query parameters (page, per_page, status)
   * @returns Promise with list of subscriptions and metadata
   */
  async getSubscriptions(params?: ListSubscriptionsRequest): Promise<ListSubscriptionsResponse> {
    const queryParams = {
      page: params?.Page,
      perPage: params?.PerPage,
      Status: params?.Status,
      search: params?.search
    };

    const response = await apiService.get<ListSubscriptionsResponse>(this.BASE_PATH, { params: queryParams });
    return response;
  }

  /**
   * Get single subscription by ID
   * @param id - Subscription ID
   * @returns Promise with subscription details
   */
  async getSubscription(id: string): Promise<SubscriptionWithPlan> {
    const response = await apiService.get<SubscriptionWithPlan>(`${this.BASE_PATH}/${id}`);
    return response;
  }

  /**
   * Update auto-renew setting for a subscription
   * @param id - Subscription ID
   * @param autoRenew - New auto-renew value
   * @returns Promise with updated subscription
   */
  async updateAutoRenew(id: string, autoRenew: boolean): Promise<{ success: boolean }> {
    const data: UpdateAutoRenewRequest = {
      auto_renew: autoRenew
    };

    const response = await apiService.put<{ success: boolean }>(`${this.BASE_PATH}/${id}/auto-renew`, data);
    return response;
  }

  /**
   * Cancel subscription (at end of period)
   * @param id - Subscription ID
   * @returns Promise with cancelled subscription
   */
  async cancelSubscription(id: string): Promise<SubscriptionWithPlan> {
    const response = await apiService.post<SubscriptionWithPlan>(`${this.BASE_PATH}/${id}/cancel`);
    return response;
  }

  /**
   * Switch protocol for a subscription (HTTP <-> SOCKS5)
   * @param id - Subscription ID
   * @param protocol - New protocol ('http' or 'socks5')
   * @returns Promise with updated proxy credentials
   */
  async switchProtocol(id: string, protocol: 'http' | 'socks5'): Promise<SwitchProtocolResponse> {
    const data: SwitchProtocolRequest = {
      protocol
    };

    const response = await apiService.post<SwitchProtocolResponse>(`${this.BASE_PATH}/${id}/switch-protocol`, data);
    return response;
  }

  /**
   * Get all subscriptions for a specific order
   * @param orderId - Order ID
   * @returns Promise with response containing subscriptions array
   */
  async getOrderSubscriptions(params: ListOrderSubscriptionsRequest): Promise<OrderSubscriptionsResponse> {
    const queryParams = {
      page: params?.Page,
      per_page: params?.per_page,
      Status: params?.Status
    };

    const response = await apiService.get<OrderSubscriptionsResponse>(`/user/orders/${params.orderId}/subscriptions`, {
      params: queryParams
    });
    return response;
  }

  /**
   * Get current proxy credentials for a subscription
   * @param id - Subscription ID
   * @returns Promise with current proxy credentials (proxy_ip, http_port, socks5_port, username, password)
   */
  async getProxy(id: string): Promise<SwitchProtocolResponse> {
    const response = await apiService.get<SwitchProtocolResponse>(`${this.BASE_PATH}/${id}/proxy`);
    return response;
  }
}

export const subscriptionService = new SubscriptionService();
