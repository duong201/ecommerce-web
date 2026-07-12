jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

import apiClient from './client'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from './products'

describe('products api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getProducts hits GET /products', () => {
    getProducts()
    expect(apiClient.get).toHaveBeenCalledWith('/products')
  })

  it('getProduct hits GET /product/:id', () => {
    getProduct(5)
    expect(apiClient.get).toHaveBeenCalledWith('/product/5')
  })

  it('createProduct hits POST /products with the payload', () => {
    const payload = { name: 'Áo thun' }
    createProduct(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/products', payload)
  })

  it('updateProduct hits PUT /product/:id with the payload', () => {
    const payload = { price: 99000 }
    updateProduct(5, payload)
    expect(apiClient.put).toHaveBeenCalledWith('/product/5', payload)
  })

  it('deleteProduct hits DELETE /product/:id', () => {
    deleteProduct(5)
    expect(apiClient.delete).toHaveBeenCalledWith('/product/5')
  })

  it('getCategories hits GET /categorize', () => {
    getCategories()
    expect(apiClient.get).toHaveBeenCalledWith('/categorize')
  })
})
