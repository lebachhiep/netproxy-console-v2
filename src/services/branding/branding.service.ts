import axios from 'axios';
import { BrandingResponse } from './branding.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staging-api.prx.network';

export class BrandingService {
  /**
   * Fetch branding data silently (no toast on error).
   * Uses axios directly instead of apiClient to avoid error toast interceptors.
   */
  public async getBranding(domain?: string): Promise<BrandingResponse> {
    const params = domain ? { domain } : {};
    const response = await axios.get<BrandingResponse>(`${API_BASE_URL}/public/branding`, {
      params,
      timeout: 10000
    });
    return response.data;
  }
}

export const brandingService = new BrandingService();
