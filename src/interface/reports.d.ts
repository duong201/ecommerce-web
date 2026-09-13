import type { Amount, Quantity, UUID } from './common'

export interface DashboardSummary {
  revenueToday: Amount
  revenueThisMonth: Amount
  ordersToday: number
  ordersPending: number
  ordersUnpaid: number
  customersTotal: number
  productsActive: number
  variantsOutOfStock: number
  batchesExpiringSoon: number
  lossValueThisMonth: Amount
  reviewsPending: number
}

export interface RevenuePoint {
  date: string
  revenue: Amount
  orders: number
}

export interface LossRow {
  productName: string
  quantityLost: Quantity
  valueLost: Amount
}

export interface TopProductRow {
  productName: string
  sku: string
  quantitySold: Quantity
  revenue: Amount
}

export interface ReconciliationRow {
  variantId: UUID
  onHand: Quantity
  byBatch: Quantity
}

export interface PickingListItem {
  sku: string
  productName: string
  variantName: string
  quantity: string
  actualQuantity: string | null
  unitType: string
  batchId: UUID | null
  expiryDate: string | null
}

export interface PickingListOrder {
  id: UUID
  order_number: string
  customer_name: string
  customer_phone: string
  status: string
  start_time: string | null
  end_time: string | null
  items: PickingListItem[]
}
