import apiClient from './client'

export const getProductReviews = (idproduct) => apiClient.get('/reviews', { params: { idproduct } })
export const addReview = (payload) => apiClient.post('/reviews', payload)
export const deleteReview = (id) => apiClient.delete(`/review/${id}`)
