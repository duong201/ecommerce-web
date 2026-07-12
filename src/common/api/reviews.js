import apiClient from './client'

export const getProductReviews = (idproduct) => apiClient.get('/reviews', { params: { idproduct } })
export const addReview = (payload, config) => apiClient.post('/reviews', payload, config)
export const deleteReview = (id) => apiClient.delete(`/review/${id}`)
