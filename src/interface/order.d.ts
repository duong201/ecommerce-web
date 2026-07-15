export interface Order {
  id: number
  idorder: number
  iduser: string
  name: string
  imgPrimary: string
  price: number
  description: string
  status: string
  address: string
  payment: string
  amount: number
  couponCode?: string
  discountAmount: number
}

export type OrderPayload = Omit<Order, 'id'>

export interface AddOrderResponse {
  status: string
}
