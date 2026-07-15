export interface Coupon {
  code: string
}

export interface ApplyCouponPayload {
  code: string
  subtotal: number
}

export interface ApplyCouponResponse {
  status: string
  coupon: Coupon
  discount: number
}
