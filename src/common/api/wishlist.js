import apiClient from './client'

export const getUserWishlist = (idUser) => apiClient.get(`/wishlist/${idUser}`)
export const addToWishlist = (payload) => apiClient.post('/wishlist', payload)
export const removeFromWishlist = (idUser, idProduct) => apiClient.delete(`/wishlist/${idUser}/${idProduct}`)
