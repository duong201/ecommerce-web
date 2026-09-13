import type { DeliverySlot, GenerateSlotsPayload, SlotPayload, UUID } from '../interface'
import { mockStore } from './mock/store'
import http, { apiOnly, unwrapPage, withFallback } from './http'

export const deliveryService = {
  listAvailable(days = 7): Promise<DeliverySlot[]> {
    return withFallback(
      () =>
        unwrapPage<DeliverySlot>(() =>
          http.get('/delivery-slots', { params: { days, limit: 100 } }),
        ),
      () => mockStore.listAvailableSlots(),
    )
  },

  listAll(fromDate?: string, toDate?: string): Promise<DeliverySlot[]> {
    return withFallback(
      () =>
        unwrapPage<DeliverySlot>(() =>
          http.get('/delivery-slots/all', { params: { fromDate, toDate, limit: 100 } }),
        ),
      () => mockStore.listAllSlots(),
    )
  },

  create(payload: SlotPayload): Promise<DeliverySlot> {
    return apiOnly(() => http.post<DeliverySlot>('/delivery-slots', payload))
  },

  generate(payload: GenerateSlotsPayload): Promise<{ created: number }> {
    return apiOnly(() => http.post<{ created: number }>('/delivery-slots/generate', payload))
  },

  update(id: UUID, payload: Partial<SlotPayload>): Promise<DeliverySlot> {
    return apiOnly(() => http.patch<DeliverySlot>(`/delivery-slots/${id}`, payload))
  },

  remove(id: UUID): Promise<{ deleted: boolean }> {
    return apiOnly(() => http.delete<{ deleted: boolean }>(`/delivery-slots/${id}`))
  },
}

export default deliveryService
