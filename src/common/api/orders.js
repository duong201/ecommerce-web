import apiClient from './client'

export const getOrders = () => apiClient.get('/order')
export const addOrder = (payload) => apiClient.post('/add-to-order', payload)
