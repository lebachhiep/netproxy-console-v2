import { apiService } from '@/services/api/api.service';
import {
  ListSubscriptionsResponse,
  ListSubscriptionsRequest,
  UpdateAutoRenewRequest,
  SubscriptionWithPlan,
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
      Page: params?.Page,
      PerPage: params?.PerPage,
      Status: params?.Status,
    };

    const response = await apiService.get<ListSubscriptionsResponse>(
      this.BASE_PATH,
      { params: queryParams }
    );
    return response;
  }

  /**
   * Get single subscription by ID
   * @param id - Subscription ID
   * @returns Promise with subscription details
   */
  async getSubscription(id: string): Promise<SubscriptionWithPlan> {
    const response = await apiService.get<SubscriptionWithPlan>(
      `${this.BASE_PATH}/${id}`
    );
    return response;
  }

  /**
   * Update auto-renew setting for a subscription
   * @param id - Subscription ID
   * @param autoRenew - New auto-renew value
   * @returns Promise with updated subscription
   */
  async updateAutoRenew(id: string, autoRenew: boolean): Promise<SubscriptionWithPlan> {
    const data: UpdateAutoRenewRequest = {
      auto_renew: autoRenew,
    };

    const response = await apiService.put<SubscriptionWithPlan>(
      `${this.BASE_PATH}/${id}/auto-renew`,
      data
    );
    return response;
  }

  /**
   * Cancel subscription (at end of period)
   * @param id - Subscription ID
   * @returns Promise with cancelled subscription
   */
  async cancelSubscription(id: string): Promise<SubscriptionWithPlan> {
    const response = await apiService.post<SubscriptionWithPlan>(
      `${this.BASE_PATH}/${id}/cancel`
    );
    return response;
  }
}

export const subscriptionService = new SubscriptionService();
