import type { BatchStatus, PaginationQuery, StockMovementType, UUID } from './common'
import type { ProductVariant, Supplier } from './catalog'

export interface InventoryBatch {
  id: UUID
  variantId: UUID
  supplierId: UUID | null
  batchCode: string
  harvestDate: string | null
  receivedDate: string
  expiryDate: string
  initialQuantity: string
  remainingQuantity: string
  unitCostAmount: string
  markdownPriceAmount: string | null
  status: BatchStatus
  note: string | null
  variant?: ProductVariant
  supplier?: Supplier
}

export interface StockMovement {
  id: UUID
  variantId: UUID
  batchId: UUID | null
  type: StockMovementType
  quantityDelta: string
  quantityAfter: string
  unitCostAmount: string | null
  orderId: UUID | null
  reason: string | null
  createdBy: UUID | null
  createdAt: string
  variant?: ProductVariant
  batch?: InventoryBatch
}

export interface BatchPayload {
  variantId: UUID
  supplierId?: UUID | null
  batchCode: string
  harvestDate?: string
  receivedDate?: string
  expiryDate: string
  quantity: number
  unitCostAmount: number
  markdownPriceAmount?: number | null
  note?: string
}

export interface UpdateBatchPayload {
  supplierId?: UUID | null
  harvestDate?: string
  expiryDate?: string
  markdownPriceAmount?: number | null
  status?: BatchStatus
  note?: string
}

export interface MovementPayload {
  batchId: UUID
  type: Extract<StockMovementType, 'spoilage' | 'damage' | 'adjustment' | 'return'>
  quantityDelta: number
  reason?: string
}

export interface BatchQuery extends PaginationQuery {
  variantId?: UUID
  supplierId?: UUID
  status?: BatchStatus
  batchCode?: string
  inStockOnly?: boolean
  expiringWithinDays?: number
}

export interface MovementQuery extends PaginationQuery {
  variantId?: UUID
  batchId?: UUID
  orderId?: UUID
  type?: StockMovementType
  from?: string
  to?: string
}
