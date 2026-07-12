import apiClient from './client'

export const getCarts = () => apiClient.get('/carts')
export const getUserCart = (idUser) => apiClient.get(`/user-cart/${idUser}`)
export const addToCart = (payload) => apiClient.post('/add-to-cart', payload)
export const updateCartAmount = (payload) => apiClient.post('/update-to-cart', payload)
export const changeCartAmount = (payload) => apiClient.post('/removeitem-to-cart', payload)
export const deleteCartItem = (id) => apiClient.delete(`/cart/${id}`)
export const clearUserCart = (idUser) => apiClient.delete(`/user-cart/${idUser}`)
