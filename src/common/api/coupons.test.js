jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

import apiClient from './client'
import { getCoupons, applyCoupon } from './coupons'

describe('coupons api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getCoupons hits GET /coupons', () => {
    getCoupons()
    expect(apiClient.get).toHaveBeenCalledWith('/coupons')
  })

  it('applyCoupon hits POST /coupons/apply with the payload', () => {
    const payload = { code: 'GIAM10', subtotal: 100000 }
    applyCoupon(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/coupons/apply', payload, undefined)
  })

  it('applyCoupon forwards an optional axios config (e.g. silentError)', () => {
    const payload = { code: 'GIAM10', subtotal: 100000 }
    applyCoupon(payload, { silentError: true })
    expect(apiClient.post).toHaveBeenCalledWith('/coupons/apply', payload, { silentError: true })
  })
})
