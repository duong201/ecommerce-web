import type {
  Coupon,
  CouponEvaluation,
  CouponPayload,
  CouponRedemption,
  UUID,
  ValidateCouponPayload,
} from '../interface'
import { mockStore } from './mock/store'
import http, { apiOnly, unwrapPage, withFallback } from './http'

export const couponService = {
  listActive(): Promise<Coupon[]> {
    return withFallback(
      () => unwrapPage<Coupon>(() => http.get('/coupons/active', { params: { limit: 100 } })),
      () => mockStore.listActiveCoupons(),
    )
  },

  listAll(): Promise<Coupon[]> {
    return withFallback(
      () => unwrapPage<Coupon>(() => http.get('/coupons', { params: { limit: 100 } })),
      () => mockStore.listCoupons(),
    )
  },

  validate(payload: ValidateCouponPayload): Promise<CouponEvaluation> {
    return withFallback(
      () => http.post<CouponEvaluation>('/coupons/validate', payload, { silentError: true }),
      () =>
        mockStore.evaluateCoupon(
          payload.code,
          payload.subtotalAmount,
          payload.deliveryFeeAmount ?? 0,
        ),
    )
  },

  redemptions(id: UUID): Promise<CouponRedemption[]> {
    return withFallback(
      () => http.get<CouponRedemption[]>(`/coupons/${id}/redemptions`),
      () => [],
    )
  },

  create(payload: CouponPayload): Promise<Coupon> {
    return apiOnly(() => http.post<Coupon>('/coupons', payload))
  },

  update(id: UUID, payload: Partial<CouponPayload>): Promise<Coupon> {
    return apiOnly(() => http.patch<Coupon>(`/coupons/${id}`, payload))
  },

  remove(id: UUID): Promise<{ deleted: boolean }> {
    return apiOnly(() => http.delete<{ deleted: boolean }>(`/coupons/${id}`))
  },
}

export default couponService
