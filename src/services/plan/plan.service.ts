import { apiService } from '@/services/api/api.service';
import {
  ListPlansParams,
  ListPlansResponse,
  Plan,
  GetCountriesResponse,
  CalculatePriceParams,
  CalculatePriceResponse
} from './plan.types';

class PlanService {
  /**
   * Get plans list with filtering support
   * @param params - Filter parameters (category, featured, pagination)
   * @returns Promise with plan items and pagination info
   */
  async listPlans(params?: ListPlansParams): Promise<ListPlansResponse> {
    // Convert boolean featured to string if needed
    const queryParams = params ? {
      ...params,
      featured: params.featured !== undefined
        ? String(params.featured)
        : undefined
    } : undefined;

    const response = await apiService.get<ListPlansResponse>('/user/plans', {
      params: queryParams,
    });
    return response;
  }

  /**
   * Get single plan by ID
   * @param id - Plan ID
   * @returns Promise with plan details
   */
  async getPlan(id: string): Promise<Plan> {
    const response = await apiService.get<Plan>(`/user/plans/${id}`);
    return response;
  }

  /**
   * Get all plans without pagination
   * Convenience method that fetches all pages
   * @param params - Filter parameters (category, featured)
   * @returns Promise with all plans
   */
  async getAllPlans(params?: Omit<ListPlansParams, 'page' | 'per_page'>): Promise<Plan[]> {
    const response = await this.listPlans({
      ...params,
      per_page: 100, // Get large page size to minimize requests
    });
    return response.items;
  }

  /**
   * Get plans filtered by type
   * Note: Type is not a backend filter, so we filter client-side
   * @param type - Plan type ('static', 'rotating', 'dedicated')
   * @param params - Additional filter parameters
   * @returns Promise with filtered plans
   */
  async getPlansByType(
    type: 'static' | 'rotating' | 'dedicated',
    params?: Omit<ListPlansParams, 'page' | 'per_page'>
  ): Promise<Plan[]> {
    const allPlans = await this.getAllPlans(params);
    return allPlans.filter(plan => plan.type === type);
  }

  /**
   * Get plans filtered by category
   * @param category - Plan category
   * @param params - Additional filter parameters
   * @returns Promise with filtered plans
   */
  async getPlansByCategory(
    category: 'datacenter' | 'mobile' | 'residential' | 'isp' | 'mixed',
    params?: Omit<ListPlansParams, 'category'>
  ): Promise<ListPlansResponse> {
    return this.listPlans({
      ...params,
      category,
    });
  }

  /**
   * Get featured plans only
   * @param params - Additional filter parameters
   * @returns Promise with featured plans
   */
  async getFeaturedPlans(
    params?: Omit<ListPlansParams, 'featured'>
  ): Promise<ListPlansResponse> {
    return this.listPlans({
      ...params,
      featured: 'true',
    });
  }

  /**
   * Get available countries for a plan
   * @param planId - Plan ID
   * @returns Promise with countries list and country_required flag
   */
  async getPlanCountries(planId: string): Promise<GetCountriesResponse> {
    const response = await apiService.get<GetCountriesResponse>(
      `/user/plans/${planId}/countries`
    );
    return response;
  }

  /**
   * Calculate dynamic price for a plan based on country and quantity
   * @param planId - Plan ID
   * @param params - Calculation parameters (country, quantity)
   * @returns Promise with calculated price
   */
  async calculatePlanPrice(
    planId: string,
    params: CalculatePriceParams
  ): Promise<CalculatePriceResponse> {
    const response = await apiService.post<CalculatePriceResponse>(
      `/user/plans/${planId}/calculate-price`,
      params
    );
    return response;
  }
}

// Export singleton instance
export const planService = new PlanService();
