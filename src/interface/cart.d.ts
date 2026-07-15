export interface CartItem {
  id: number
  iduser: string
  idproduct: number
  name: string
  imgPrimary: string
  price: number
  discount: number
  amount: number
  color?: string
  size?: string
}

export type AddToCartPayload = Omit<CartItem, 'id'>

export interface AddToCartResponse {
  status: string
  cart: CartItem
}

export interface UpdateCartAmountPayload {
  id: number
  amount: number
}

export interface UpdateCartAmountResponse {
  status: string
}
