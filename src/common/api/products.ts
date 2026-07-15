import apiClient from './client'
import type { Product, Category, ProductPayload } from '../../interface'

export const getProducts = () => apiClient.get<Product[]>('/products')
export const getProduct = (id: number | string) => apiClient.get<Product>(`/product/${id}`)
export const createProduct = (payload: ProductPayload) =>
  apiClient.post<Product>('/products', payload)
export const updateProduct = (id: number | string, payload: ProductPayload) =>
  apiClient.put<Product>(`/product/${id}`, payload)
export const deleteProduct = (id: number | string) => apiClient.delete(`/product/${id}`)
export const getCategories = () => apiClient.get<Category[]>('/categorize')
