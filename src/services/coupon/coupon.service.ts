import { apiService } from '@/services/api/api.service';
import { ValidateCouponRequest, ValidateCouponResponse, CouponValidationResult } from './coupon.types';

/**
 * Coupon Service
 * Handles coupon validation via authenticated API endpoint
 */
class CouponService {
  /**
   * Validate a coupon code
   *
   * @param code - Coupon code to validate
   * @param orderAmount - Total order amount for validation
   * @param planId - Optional plan ID to check plan eligibility
   * @returns Validation result with discount amount if valid
   */
  async validateCoupon(code: string, orderAmount: number, planId?: string): Promise<CouponValidationResult> {
    try {
      const payload: ValidateCouponRequest = {
        code,
        order_amount: orderAmount
      };

      if (planId) payload.plan_id = planId;

      const response = await apiService.post<ValidateCouponResponse>('/user/coupons/validate', payload);

      if (response.valid) {
        return {
          success: true,
          discount: response.discount_amount || 0,
          coupon: response.coupon
        };
      } else {
        return {
          success: false,
          error: response.validation_error || 'Mã giảm giá không hợp lệ'
        };
      }
    } catch (error: any) {
      console.error('Coupon validation error:', error);

      // Handle specific error messages from backend
      const errorMessage =
        error.response?.data?.validation_error || error.response?.data?.message || 'Không thể xác thực mã giảm giá. Vui lòng thử lại.';

      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

export const couponService = new CouponService();
