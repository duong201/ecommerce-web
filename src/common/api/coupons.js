import apiClient from './client'

export const getCoupons = () => apiClient.get('/coupons')
export const applyCoupon = (payload, config) => apiClient.post('/coupons/apply', payload, config)
