export type UUID = string

export type Amount = number

export type Quantity = number

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface ApiErrorBody {
  status: 'error'
  message: string
  [key: string]: unknown
}

export const ROLE = {
  CUSTOMER: 1,
  MANAGER: 2,
  ADMIN: 3,
} as const

export type RoleId = (typeof ROLE)[keyof typeof ROLE]

export type ProductStatus = 'draft' | 'active' | 'out_of_season' | 'archived'
export type StorageType = 'ambient' | 'chilled' | 'frozen'
export type Certification = 'vietgap' | 'globalgap' | 'organic' | 'none'
export type UnitType = 'kg' | 'gram' | 'piece' | 'box' | 'tray' | 'combo'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type BatchStatus = 'active' | 'expired' | 'discarded'
export type StockMovementType =
  'purchase' | 'sale' | 'return' | 'spoilage' | 'expired' | 'damage' | 'adjustment'
export type CartStatus = 'active' | 'converted' | 'abandoned'
export type OrderStatus =
  'pending' | 'confirmed' | 'picking' | 'delivering' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'partially_refunded' | 'refunded' | 'failed'
export type PaymentTxnStatus = 'pending' | 'captured' | 'failed' | 'cancelled'
export type PaymentProvider = 'cod' | 'vnpay' | 'momo' | 'bank_transfer'
export type RefundReasonType =
  'damaged' | 'not_fresh' | 'wrong_item' | 'short_weight' | 'late_delivery' | 'other'
export type RefundStatus = 'pending' | 'completed' | 'rejected'
export type CouponType = 'percentage' | 'fixed_amount' | 'free_delivery'
