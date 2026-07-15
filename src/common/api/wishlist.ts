import apiClient from './client'
import type { WishlistItem, AddToWishlistPayload, AddToWishlistResponse } from '../../interface'

export const getUserWishlist = (idUser: string | number) =>
  apiClient.get<WishlistItem[]>(`/wishlist/${idUser}`)
export const addToWishlist = (payload: AddToWishlistPayload) =>
  apiClient.post<AddToWishlistResponse>('/wishlist', payload)
export const removeFromWishlist = (idUser: string | number, idProduct: string | number) =>
  apiClient.delete(`/wishlist/${idUser}/${idProduct}`)
