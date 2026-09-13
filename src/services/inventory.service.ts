import type {
  BatchPayload,
  BatchQuery,
  InventoryBatch,
  InventoryLevel,
  MovementPayload,
  MovementQuery,
  Paginated,
  StockMovement,
  UUID,
  UpdateBatchPayload,
} from '../interface'
import { mockStore } from './mock/store'
import { params } from './queryParams'
import http, { apiOnly, unwrapPage, withFallback } from './http'

export const inventoryService = {
  listBatches(query: BatchQuery = {}): Promise<Paginated<InventoryBatch>> {
    return withFallback(
      () => http.get<Paginated<InventoryBatch>>('/inventory/batches', { params: params(query) }),
      () => mockStore.listBatches(query),
    )
  },

  getBatch(id: UUID): Promise<InventoryBatch> {
    return withFallback(
      () => http.get<InventoryBatch>(`/inventory/batches/${id}`),
      () => {
        const batch = mockStore.listBatches({ limit: 500 }).data.find((row) => row.id === id)
        if (!batch) throw new Error('Batch not found')
        return batch
      },
    )
  },

  createBatch(payload: BatchPayload): Promise<InventoryBatch> {
    return apiOnly(() => http.post<InventoryBatch>('/inventory/batches', payload))
  },

  updateBatch(id: UUID, payload: UpdateBatchPayload): Promise<InventoryBatch> {
    return apiOnly(() => http.patch<InventoryBatch>(`/inventory/batches/${id}`, payload))
  },

  removeBatch(id: UUID): Promise<{ deleted: boolean }> {
    return apiOnly(() => http.delete<{ deleted: boolean }>(`/inventory/batches/${id}`))
  },

  listLevels(lowStockThreshold?: number): Promise<InventoryLevel[]> {
    return withFallback(
      () =>
        unwrapPage<InventoryLevel>(() =>
          http.get('/inventory/levels', { params: params({ lowStockThreshold, limit: 100 }) }),
        ),
      () => mockStore.listLevels(),
    )
  },

  getLevel(variantId: UUID): Promise<InventoryLevel> {
    return withFallback(
      () => http.get<InventoryLevel>(`/inventory/levels/${variantId}`),
      () => {
        const level = mockStore.listLevels().find((row) => row.variantId === variantId)
        if (!level) throw new Error('No stock level recorded for this variant yet')
        return level
      },
    )
  },

  expiring(withinDays = 2): Promise<InventoryBatch[]> {
    return withFallback(
      () => http.get<InventoryBatch[]>('/inventory/expiring', { params: { withinDays } }),
      () => mockStore.listExpiringBatches(withinDays),
    )
  },

  listMovements(query: MovementQuery = {}): Promise<Paginated<StockMovement>> {
    return withFallback(
      () => http.get<Paginated<StockMovement>>('/inventory/movements', { params: params(query) }),
      () => mockStore.listMovements(query),
    )
  },

  recordMovement(payload: MovementPayload): Promise<StockMovement> {
    return apiOnly(() => http.post<StockMovement>('/inventory/movements', payload))
  },

  expireBatches(): Promise<{ expired: number }> {
    return apiOnly(() => http.post<{ expired: number }>('/inventory/expire-batches'))
  },
}

export default inventoryService
