import apiClient from './client'
import type {
  CartItem,
  AddToCartPayload,
  AddToCartResponse,
  UpdateCartAmountPayload,
  UpdateCartAmountResponse,
} from '../../interface'

export const getCarts = () => apiClient.get<CartItem[]>('/carts')
export const getUserCart = (idUser: string | number) =>
  apiClient.get<CartItem[]>(`/user-cart/${idUser}`)
export const addToCart = (payload: AddToCartPayload) =>
  apiClient.post<AddToCartResponse>('/add-to-cart', payload)
export const updateCartAmount = (payload: UpdateCartAmountPayload) =>
  apiClient.post<UpdateCartAmountResponse>('/update-to-cart', payload)
export const changeCartAmount = (payload: UpdateCartAmountPayload) =>
  apiClient.post<UpdateCartAmountResponse>('/removeitem-to-cart', payload)
export const deleteCartItem = (id: number | string) => apiClient.delete(`/cart/${id}`)
export const clearUserCart = (idUser: string | number) => apiClient.delete(`/user-cart/${idUser}`)
