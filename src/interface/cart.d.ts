import type { Amount, CartStatus, Quantity, UUID, UnitType } from './common'

export interface CartLine {
  variantId: UUID
  sku: string
  variantName: string
  productId: UUID
  productName: string
  productSlug: string
  imageUrl: string | null
  unitType: UnitType
  isWeighted: boolean
  stepQuantity: Quantity
  quantity: Quantity
  unitPriceAmount: Amount
  currentPriceAmount: Amount
  priceChanged: boolean
  lineTotal: Amount
  availableQuantity: Quantity
  stockIssue: string | null
}

export interface Cart {
  id: UUID | ''
  status: CartStatus
  couponCode: string | null
  items: CartLine[]
  subtotalAmount: Amount
  discountAmount: Amount
  couponMessage: string | null
  itemCount: number
  hasIssues: boolean
}

export interface AddCartItemPayload {
  variantId: UUID
  quantity: number
}
