export interface WishlistItem {
  id: number
  iduser: string
  idproduct: number
  name: string
  imgPrimary: string
  price: number
  discount: number
}

export type AddToWishlistPayload = Omit<WishlistItem, 'id'>

export interface AddToWishlistResponse {
  status: string
  wishlistItem: WishlistItem
}
