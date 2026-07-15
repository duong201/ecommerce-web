import handleCart from './handleCart'
import { ADDCART, DELETECART } from '../action/index'

describe('handleCart reducer', () => {
  it('returns an empty array as the initial state', () => {
    expect(handleCart(undefined, { type: '@@INIT' })).toEqual([])
  })

  it('adds a new product to an empty cart with qty 1', () => {
    const product = { id: 1, name: 'Áo thun' }
    const state = handleCart([], ADDCART(product))
    expect(state).toEqual([{ id: 1, name: 'Áo thun', qty: 1 }])
  })

  it('increments qty when adding a product already in the cart', () => {
    const initial = [{ id: 1, name: 'Áo thun', qty: 1 }]
    const state = handleCart(initial, ADDCART({ id: 1, name: 'Áo thun' }))
    expect(state).toEqual([{ id: 1, name: 'Áo thun', qty: 2 }])
  })

  it('leaves other items untouched when adding one item', () => {
    const initial = [
      { id: 1, name: 'A', qty: 1 },
      { id: 2, name: 'B', qty: 3 },
    ]
    const state = handleCart(initial, ADDCART({ id: 2, name: 'B' }))
    expect(state).toEqual([
      { id: 1, name: 'A', qty: 1 },
      { id: 2, name: 'B', qty: 4 },
    ])
  })

  it('decrements qty when deleting one of multiple', () => {
    const initial = [{ id: 1, name: 'Áo thun', qty: 2 }]
    const state = handleCart(initial, DELETECART({ id: 1 }))
    expect(state).toEqual([{ id: 1, name: 'Áo thun', qty: 1 }])
  })

  it('removes the item entirely when qty drops to 0', () => {
    const initial = [{ id: 1, name: 'Áo thun', qty: 1 }]
    const state = handleCart(initial, DELETECART({ id: 1 }))
    expect(state).toEqual([])
  })

  it('is a no-op when deleting a product not present in the cart', () => {
    const initial = [{ id: 1, name: 'Áo thun', qty: 1 }]
    const state = handleCart(initial, DELETECART({ id: 999 }))
    expect(state).toBe(initial)
  })

  it('returns the same state for an unknown action type', () => {
    const initial = [{ id: 1, name: 'Áo thun', qty: 1 }]
    expect(handleCart(initial, { type: 'UNKNOWN', payload: { id: 0 } })).toBe(initial)
  })
})
