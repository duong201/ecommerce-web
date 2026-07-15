import { AxiosRequestConfig } from 'axios'
import apiClient from './client'
import type { Order, OrderPayload, AddOrderResponse } from '../../interface'

export const getOrders = () => apiClient.get<Order[]>('/order')
export const addOrder = (payload: OrderPayload, config?: AxiosRequestConfig) =>
  apiClient.post<AddOrderResponse>('/add-to-order', payload, config)
