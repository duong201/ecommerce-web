jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

import apiClient from './client'
import { getOrders, addOrder } from './orders'

describe('orders api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getOrders hits GET /order', () => {
    getOrders()
    expect(apiClient.get).toHaveBeenCalledWith('/order')
  })

  it('addOrder hits POST /add-to-order with the payload', () => {
    const payload = { iduser: '2', idorder: 123, amount: 1 }
    addOrder(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/add-to-order', payload)
  })
})
