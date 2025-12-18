import { apiService } from '@/services/api/api.service';
import { PlansResponse, Plan, GetCountriesResponse, CalculatePriceParams, CalculatePriceResponse } from './plan.types';

class PlanService {
  /**
   * Get plans list - new format with server and rotate
   * @returns Promise with plans grouped by server and rotating plans
   */
  async listPlans(): Promise<PlansResponse> {
    const response = await apiService.get<PlansResponse>('/user/plans');
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
   * Get all plans - returns new format with server and rotate
   * @returns Promise with plans grouped by server and rotating plans
   */
  async getAllPlans(): Promise<PlansResponse> {
    return this.listPlans();
  }

  /**
   * Get plans filtered by type
   * Note: Filters from the new response format
   * @param type - Plan type ('static', 'rotating', 'dedicated')
   * @returns Promise with filtered plans
   */
  async getPlansByType(type: 'static' | 'rotating' | 'dedicated'): Promise<Plan[]> {
    const data = await this.getAllPlans();

    if (type === 'rotating') {
      return data.rotate;
    }

    // For dedicated/static, get from dedicated object
    const allDedicatedPlans = Object.values(data.dedicated).flat();
    return allDedicatedPlans.filter((plan) => plan.type === type);
  }

  /**
   * Get plans filtered by category
   * Note: Filters from the new response format
   * @param category - Plan category
   * @returns Promise with filtered plans
   */
  async getPlansByCategory(category: 'datacenter' | 'mobile' | 'residential' | 'isp' | 'mixed'): Promise<Plan[]> {
    const data = await this.getAllPlans();
    const allPlans = [...data.rotate, ...Object.values(data.dedicated).flat()];
    return allPlans.filter((plan) => plan.category === category);
  }

  /**
   * Get featured plans only
   * Note: Filters from the new response format
   * @returns Promise with featured plans
   */
  async getFeaturedPlans(): Promise<Plan[]> {
    const data = await this.getAllPlans();
    const allPlans = [...data.rotate, ...Object.values(data.dedicated).flat()];
    return allPlans.filter((plan) => plan.featured);
  }

  /**
   * Get available countries for a plan
   * @param planId - Plan ID
   * @returns Promise with countries list and country_required flag
   */
  async getPlanCountries(planId: string): Promise<GetCountriesResponse> {
    const response = await apiService.get<GetCountriesResponse>(`/user/plans/${planId}/countries`);
    return response;
  }

  /**
   * Calculate dynamic price for a plan based on country and quantity
   * @param planId - Plan ID
   * @param params - Calculation parameters (country, quantity)
   * @returns Promise with calculated price
   */
  async calculatePlanPrice(planId: string, params: CalculatePriceParams): Promise<CalculatePriceResponse> {
    const response = await apiService.post<CalculatePriceResponse>(`/user/plans/${planId}/calculate-price`, params);
    return response;
  }
}

// Export singleton instance
export const planService = new PlanService();
