import type {
  Amount,
  OrderStatus,
  PaginationQuery,
  PaymentProvider,
  PaymentStatus,
  PaymentTxnStatus,
  Quantity,
  RefundReasonType,
  RefundStatus,
  UUID,
  UnitType,
} from './common'
import type { DeliverySlot } from './delivery'

export interface OrderAddress {
  recipientName: string
  phone: string
  line1: string
  ward?: string | null
  district: string
  province: string
  deliveryNote?: string | null
}

export interface OrderItem {
  id: UUID
  orderId: UUID
  variantId: UUID | null
  batchId: UUID | null
  productName: string
  variantName: string
  sku: string
  unitType: UnitType
  imageUrl: string | null
  expiryDate: string | null
  orderedQuantity: string
  actualQuantity: string | null
  unitPriceAmount: string
  totalAmount: string
}

export interface Order {
  id: UUID
  orderNumber: string
  userId: UUID | null
  customerName: string
  customerPhone: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  deliverySlotId: UUID | null
  deliveryDate: string
  subtotalAmount: string
  discountAmount: string
  deliveryFeeAmount: string
  weightAdjustAmount: string
  grandTotalAmount: string
  couponCode: string | null
  customerNote: string | null
  internalNote: string | null
  cancelReason: string | null
  completedAt: string | null
  createdAt: string
  items?: OrderItem[]
  address?: OrderAddress
  deliverySlot?: DeliverySlot
}

export interface OrderStatusHistoryEntry {
  id: UUID
  orderId: UUID
  field: 'status' | 'payment_status'
  fromValue: string | null
  toValue: string
  note: string | null
  changedBy: UUID | null
  createdAt: string
  changedByUser?: { id: UUID; fullName: string } | null
}

export interface CheckoutPayload {
  customerName: string
  customerPhone: string
  address: OrderAddress
  deliveryDate: string
  deliverySlotId?: UUID
  paymentProvider: PaymentProvider
  couponCode?: string
  customerNote?: string
  idempotencyKey?: string
}

export interface OrderQuery extends PaginationQuery {
  q?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  deliveryDate?: string
  deliverySlotId?: UUID
  userId?: UUID
  from?: string
  to?: string
}

export interface Payment {
  id: UUID
  orderId: UUID
  provider: PaymentProvider
  amount: string
  status: PaymentTxnStatus
  providerTxnId: string | null
  capturedAt: string | null
  createdAt: string
}

export interface Refund {
  id: UUID
  orderId: UUID
  paymentId: UUID | null
  amount: string
  reasonType: RefundReasonType
  reason: string | null
  status: RefundStatus
  processedBy: UUID | null
  processedAt: string | null
  createdAt: string
  order?: Order
}

export interface CreateRefundPayload {
  orderId: UUID
  paymentId?: UUID
  amount: number
  reasonType: RefundReasonType
  reason?: string
}

export interface RefundReasonBreakdown {
  reasonType: RefundReasonType
  count: number
  amount: Amount
}

export interface WeighItemPayload {
  actualQuantity: Quantity
}
