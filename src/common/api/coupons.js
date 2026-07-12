import apiClient from './client'

export const getCoupons = () => apiClient.get('/coupons')
export const applyCoupon = (payload) => apiClient.post('/coupons/apply', payload)
