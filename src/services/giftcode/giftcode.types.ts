export interface RedeemGiftCodeRequest {
  code: string;
}

export interface RedeemGiftCodeResponse {
  success: boolean;
  message: string;
  order_id?: string;
  balance_added?: number;
}
