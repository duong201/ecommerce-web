import type {
  DashboardSummary,
  LossRow,
  PickingListOrder,
  ReconciliationRow,
  RevenuePoint,
  TopProductRow,
} from '../interface'
import { mockStore } from './mock/store'
import http, { withFallback } from './http'

export const reportService = {
  dashboard(): Promise<DashboardSummary> {
    return withFallback(
      () => http.get<DashboardSummary>('/reports/dashboard'),
      () => mockStore.dashboard(),
    )
  },

  revenue(days = 30): Promise<RevenuePoint[]> {
    return withFallback(
      () => http.get<RevenuePoint[]>('/reports/revenue', { params: { days } }),
      () => mockStore.revenueSeries(days),
    )
  },

  loss(from?: string, to?: string): Promise<LossRow[]> {
    return withFallback(
      () => http.get<LossRow[]>('/reports/loss', { params: { from, to } }),
      () => mockStore.lossReport(),
    )
  },

  topProducts(limit = 10): Promise<TopProductRow[]> {
    return withFallback(
      () => http.get<TopProductRow[]>('/reports/top-products', { params: { limit } }),
      () => mockStore.topProducts(limit),
    )
  },

  reconciliation(): Promise<ReconciliationRow[]> {
    return withFallback(
      () => http.get<ReconciliationRow[]>('/reports/stock-reconciliation'),
      () => [],
    )
  },

  pickingList(deliveryDate?: string): Promise<PickingListOrder[]> {
    return withFallback(
      () => http.get<PickingListOrder[]>('/reports/picking-list', { params: { deliveryDate } }),
      () => [],
    )
  },
}

export default reportService
