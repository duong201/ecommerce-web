jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}))

import apiClient from './client'
import { getUserWishlist, addToWishlist, removeFromWishlist } from './wishlist'

describe('wishlist api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getUserWishlist hits GET /wishlist/:idUser', () => {
    getUserWishlist('2')
    expect(apiClient.get).toHaveBeenCalledWith('/wishlist/2')
  })

  it('addToWishlist hits POST /wishlist with the payload', () => {
    const payload = { iduser: '2', idproduct: 1 }
    addToWishlist(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/wishlist', payload)
  })

  it('removeFromWishlist hits DELETE /wishlist/:idUser/:idProduct', () => {
    removeFromWishlist('2', 1)
    expect(apiClient.delete).toHaveBeenCalledWith('/wishlist/2/1')
  })
})
