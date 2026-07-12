import apiClient from './client'

export const getProducts = () => apiClient.get('/products')
export const getProduct = (id) => apiClient.get(`/product/${id}`)
export const createProduct = (payload) => apiClient.post('/products', payload)
export const updateProduct = (id, payload) => apiClient.put(`/product/${id}`, payload)
export const deleteProduct = (id) => apiClient.delete(`/product/${id}`)
export const getCategories = () => apiClient.get('/categorize')
