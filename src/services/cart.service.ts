import type { Cart, UUID } from '../interface'
import { getSessionToken } from '../common/utils/session'
import { mockStore } from './mock/store'
import http, { withFallback } from './http'

export const cartService = {
  get(): Promise<Cart> {
    return withFallback(
      () => http.get<Cart>('/cart'),
      () => mockStore.getCart(),
    )
  },

  addItem(variantId: UUID, quantity: number): Promise<Cart> {
    return withFallback(
      () => http.post<Cart>('/cart/items', { variantId, quantity }, { silentError: true }),
      () => mockStore.addCartItem(variantId, quantity),
    )
  },

  setQuantity(variantId: UUID, quantity: number): Promise<Cart> {
    return withFallback(
      () => http.patch<Cart>(`/cart/items/${variantId}`, { quantity }, { silentError: true }),
      () => mockStore.setCartQuantity(variantId, quantity),
    )
  },

  removeItem(variantId: UUID): Promise<Cart> {
    return withFallback(
      () => http.delete<Cart>(`/cart/items/${variantId}`),
      () => mockStore.removeCartItem(variantId),
    )
  },

  clear(): Promise<Cart> {
    return withFallback(
      () => http.delete<Cart>('/cart'),
      () => mockStore.clearCart(),
    )
  },

  applyCoupon(code: string): Promise<Cart> {
    return withFallback(
      () => http.post<Cart>('/cart/coupon', { code }, { silentError: true }),
      () => mockStore.applyCartCoupon(code),
    )
  },

  removeCoupon(): Promise<Cart> {
    return withFallback(
      () => http.delete<Cart>('/cart/coupon'),
      () => mockStore.removeCartCoupon(),
    )
  },

  merge(): Promise<Cart> {
    return withFallback(
      () =>
        http.post<Cart>('/cart/merge', { sessionToken: getSessionToken() }, { silentError: true }),
      () => mockStore.getCart(),
    )
  },
}

export default cartService
