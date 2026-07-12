import apiClient from './client'

export const getOrders = () => apiClient.get('/order')
export const addOrder = (payload, config) => apiClient.post('/add-to-order', payload, config)
