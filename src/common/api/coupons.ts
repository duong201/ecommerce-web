import { AxiosRequestConfig } from 'axios'
import apiClient from './client'
import type { Coupon, ApplyCouponPayload, ApplyCouponResponse } from '../../interface'

export const getCoupons = () => apiClient.get<Coupon[]>('/coupons')
export const applyCoupon = (payload: ApplyCouponPayload, config?: AxiosRequestConfig) =>
  apiClient.post<ApplyCouponResponse>('/coupons/apply', payload, config)
