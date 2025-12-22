// Coupon validation request
export interface ValidateCouponRequest {
  code: string; // Required: Coupon code
  order_amount: number; // Required: Min 0
  plan_id?: string; // Optional: UUID4 format
}

// Coupon data from backend
export interface Coupon {
  id: string;
  code: string;
  type: string; // "percentage" or "fixed"
  discount: number; // Percentage (e.g., 10 for 10%) or fixed amount
  currency_code: string;
  description?: string;
  reseller_id?: string;
  expires_at: string; // ISO timestamp
}

// Validation response
export interface ValidateCouponResponse {
  valid: boolean;
  validation_error?: string; // Present if valid=false
  coupon?: Coupon; // Present if valid=true
  discount_amount?: number; // Calculated discount in order currency
}

// Validation result (for easier use in components)
export interface CouponValidationResult {
  success: boolean;
  error?: string;
  discount?: number;
  coupon?: Coupon;
}
