import { ADDCART, DELETECART } from './index'
import { ADD_PRODUCT, DELETE_PRODUCT } from './actionTypes'

describe('cart action creators', () => {
  it('ADDCART builds an ADD_PRODUCT action carrying the product as payload', () => {
    const product = { id: 1, name: 'Áo thun' }
    expect(ADDCART(product)).toEqual({ type: ADD_PRODUCT, payload: product })
  })

  it('DELETECART builds a DELETE_PRODUCT action carrying the product as payload', () => {
    const product = { id: 1, name: 'Áo thun' }
    expect(DELETECART(product)).toEqual({ type: DELETE_PRODUCT, payload: product })
  })
})
