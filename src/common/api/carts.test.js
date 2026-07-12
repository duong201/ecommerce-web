import apiClient from './client'
import {
  getCarts,
  getUserCart,
  addToCart,
  updateCartAmount,
  changeCartAmount,
  deleteCartItem,
  clearUserCart,
} from './carts'

jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('carts api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getCarts hits GET /carts', () => {
    getCarts()
    expect(apiClient.get).toHaveBeenCalledWith('/carts')
  })

  it('getUserCart hits GET /user-cart/:idUser', () => {
    getUserCart('2')
    expect(apiClient.get).toHaveBeenCalledWith('/user-cart/2')
  })

  it('addToCart hits POST /add-to-cart with the payload', () => {
    const payload = { iduser: '2', idproduct: 1, amount: 1 }
    addToCart(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/add-to-cart', payload)
  })

  it('updateCartAmount hits POST /update-to-cart with the payload', () => {
    const payload = { id: 1, amount: 3 }
    updateCartAmount(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/update-to-cart', payload)
  })

  it('changeCartAmount hits POST /removeitem-to-cart with the payload', () => {
    const payload = { id: 1, amount: 1 }
    changeCartAmount(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/removeitem-to-cart', payload)
  })

  it('deleteCartItem hits DELETE /cart/:id', () => {
    deleteCartItem(1)
    expect(apiClient.delete).toHaveBeenCalledWith('/cart/1')
  })

  it('clearUserCart hits DELETE /user-cart/:idUser', () => {
    clearUserCart('2')
    expect(apiClient.delete).toHaveBeenCalledWith('/user-cart/2')
  })
})
