import type { UUID } from './common'

export interface DeliverySlot {
  id: UUID
  slotDate: string
  startTime: string
  endTime: string
  maxOrders: number
  bookedCount: number
  isActive: boolean
  label: string
  remaining: number
}

export interface SlotPayload {
  slotDate: string
  startTime: string
  endTime: string
  maxOrders: number
  isActive?: boolean
}

export interface GenerateSlotsPayload {
  fromDate?: string
  days: number
  maxOrders: number
  windows?: { startTime: string; endTime: string }[]
}
