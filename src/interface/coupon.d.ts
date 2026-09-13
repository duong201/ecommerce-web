import type { Amount, CouponType, UUID } from './common'

export interface Coupon {
  id: UUID
  code: string
  name: string
  type: CouponType
  value: string
  maxDiscountAmount: string | null
  minOrderAmount: string
  usageLimit: number | null
  usageLimitPerUser: number | null
  usedCount: number
  startsAt: string
  endsAt: string | null
  isActive: boolean
}

export interface CouponPayload {
  code: string
  name: string
  type: CouponType
  value: number
  maxDiscountAmount?: number | null
  minOrderAmount?: number
  usageLimit?: number | null
  usageLimitPerUser?: number | null
  startsAt: string
  endsAt?: string | null
  isActive?: boolean
}

export interface CouponEvaluation {
  valid: boolean
  reason?: string
  coupon?: Coupon
  discountAmount: Amount
  deliveryDiscount: Amount
}

export interface ValidateCouponPayload {
  code: string
  subtotalAmount: number
  deliveryFeeAmount?: number
}

export interface CouponRedemption {
  couponId: UUID
  orderId: UUID
  userId: UUID | null
  createdAt: string
}
