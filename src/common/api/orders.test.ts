import apiClient from './client'
import { getOrders, addOrder } from './orders'

jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

describe('orders api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getOrders hits GET /order', () => {
    getOrders()
    expect(apiClient.get).toHaveBeenCalledWith('/order')
  })

  const payload = {
    iduser: '2',
    idorder: 123,
    name: 'Áo thun',
    imgPrimary: 'img.jpg',
    price: 150000,
    description: '',
    status: 'Đang chuẩn bị hàng',
    address: 'Huế',
    payment: 'COD',
    amount: 1,
    discountAmount: 0,
  }

  it('addOrder hits POST /add-to-order with the payload', () => {
    addOrder(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/add-to-order', payload, undefined)
  })

  it('addOrder forwards an optional axios config (e.g. silentError)', () => {
    addOrder(payload, { silentError: true })
    expect(apiClient.post).toHaveBeenCalledWith('/add-to-order', payload, { silentError: true })
  })
})
