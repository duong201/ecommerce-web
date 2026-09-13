import type {
  CheckoutPayload,
  CreateRefundPayload,
  Order,
  OrderQuery,
  OrderStatus,
  OrderStatusHistoryEntry,
  Paginated,
  Payment,
  PaymentStatus,
  Refund,
  RefundReasonBreakdown,
  RefundStatus,
  UUID,
} from '../interface'
import { mockStore } from './mock/store'
import { params } from './queryParams'
import http, { apiOnly, unwrapPage, withFallback } from './http'

export const orderService = {
  list(query: OrderQuery = {}): Promise<Paginated<Order>> {
    return withFallback(
      () => http.get<Paginated<Order>>('/orders', { params: params(query) }),
      () => mockStore.listOrders(query.page, query.limit),
    )
  },

  get(id: UUID): Promise<Order> {
    return withFallback(
      () => http.get<Order>(`/orders/${id}`),
      () => mockStore.getOrder(id),
    )
  },

  history(id: UUID): Promise<OrderStatusHistoryEntry[]> {
    return withFallback(
      () => http.get<OrderStatusHistoryEntry[]>(`/orders/${id}/history`),
      () => mockStore.getOrderHistory(id),
    )
  },

  checkout(payload: CheckoutPayload): Promise<Order> {
    const body: CheckoutPayload = {
      ...payload,
      idempotencyKey:
        payload.idempotencyKey ?? `chk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    }

    return withFallback(
      () => http.post<Order>('/orders', body, { silentError: true }),
      () =>
        mockStore.checkout({
          customerName: body.customerName,
          customerPhone: body.customerPhone,
          address: body.address,
          deliveryDate: body.deliveryDate,
          deliverySlotId: body.deliverySlotId,
          paymentProvider: body.paymentProvider,
          couponCode: body.couponCode,
          customerNote: body.customerNote,
        } as never),
    )
  },

  cancel(id: UUID, reason?: string): Promise<Order> {
    return withFallback(
      () => http.post<Order>(`/orders/${id}/cancel`, { reason }, { silentError: true }),
      () => mockStore.updateOrderStatus(id, 'cancelled', reason),
    )
  },

  updateStatus(id: UUID, status: OrderStatus, note?: string): Promise<Order> {
    return withFallback(
      () => http.patch<Order>(`/orders/${id}/status`, { status, note }, { silentError: true }),
      () => mockStore.updateOrderStatus(id, status, note),
    )
  },

  updatePaymentStatus(id: UUID, paymentStatus: PaymentStatus, note?: string): Promise<Order> {
    return apiOnly(() => http.patch<Order>(`/orders/${id}/payment-status`, { paymentStatus, note }))
  },

  weighItem(orderId: UUID, itemId: UUID, actualQuantity: number): Promise<Order> {
    return apiOnly(() =>
      http.patch<Order>(`/orders/${orderId}/items/${itemId}/weigh`, { actualQuantity }),
    )
  },

  findByBatch(batchId: UUID): Promise<Order[]> {
    return withFallback(
      () => http.get<Order[]>(`/orders/by-batch/${batchId}`),
      () =>
        mockStore
          .listOrders(1, 100)
          .data.filter((order) => (order.items ?? []).some((item) => item.batchId === batchId)),
    )
  },
}

export const paymentService = {
  listByOrder(orderId: UUID): Promise<Payment[]> {
    return withFallback(
      () => http.get<Payment[]>(`/orders/${orderId}/payments`),
      () => [],
    )
  },

  capture(id: UUID, providerTxnId?: string): Promise<Payment> {
    return apiOnly(() => http.patch<Payment>(`/payments/${id}/capture`, { providerTxnId }))
  },

  fail(id: UUID, reason?: string): Promise<Payment> {
    return apiOnly(() => http.patch<Payment>(`/payments/${id}/fail`, { reason }))
  },
}

export const refundService = {
  list(orderId?: UUID): Promise<Refund[]> {
    return withFallback(
      () =>
        unwrapPage<Refund>(() => http.get('/refunds', { params: params({ orderId, limit: 100 }) })),
      () => [],
    )
  },

  reasonBreakdown(from?: string, to?: string): Promise<RefundReasonBreakdown[]> {
    return withFallback(
      () => http.get<RefundReasonBreakdown[]>('/refunds/reasons', { params: params({ from, to }) }),
      () => [
        { reasonType: 'not_fresh', count: 12, amount: 1_450_000 },
        { reasonType: 'short_weight', count: 7, amount: 620_000 },
        { reasonType: 'damaged', count: 5, amount: 780_000 },
        { reasonType: 'late_delivery', count: 3, amount: 210_000 },
      ],
    )
  },

  create(payload: CreateRefundPayload): Promise<Refund> {
    return apiOnly(() => http.post<Refund>('/refunds', payload))
  },

  process(
    id: UUID,
    status: Extract<RefundStatus, 'completed' | 'rejected'>,
    reason?: string,
  ): Promise<Refund> {
    return apiOnly(() => http.patch<Refund>(`/refunds/${id}`, { status, reason }))
  },
}
