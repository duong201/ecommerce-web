import apiClient from './client'
import { getProductReviews, addReview, deleteReview } from './reviews'

jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('reviews api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getProductReviews hits GET /reviews with the idproduct param', () => {
    getProductReviews(1)
    expect(apiClient.get).toHaveBeenCalledWith('/reviews', { params: { idproduct: 1 } })
  })

  const payload = { idproduct: 1, iduser: '2', userName: 'Khách hàng', rating: 5 }

  it('addReview hits POST /reviews with the payload', () => {
    addReview(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/reviews', payload, undefined)
  })

  it('addReview forwards an optional axios config (e.g. silentError)', () => {
    addReview(payload, { silentError: true })
    expect(apiClient.post).toHaveBeenCalledWith('/reviews', payload, { silentError: true })
  })

  it('deleteReview hits DELETE /review/:id', () => {
    deleteReview(1)
    expect(apiClient.delete).toHaveBeenCalledWith('/review/1')
  })
})
