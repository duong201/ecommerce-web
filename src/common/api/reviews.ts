import { AxiosRequestConfig } from 'axios'
import apiClient from './client'
import type { Review, AddReviewPayload, AddReviewResponse } from '../../interface'

export const getProductReviews = (idproduct: number | string) =>
  apiClient.get<Review[]>('/reviews', { params: { idproduct } })
export const addReview = (payload: AddReviewPayload, config?: AxiosRequestConfig) =>
  apiClient.post<AddReviewResponse>('/reviews', payload, config)
export const deleteReview = (id: number | string) => apiClient.delete(`/review/${id}`)
