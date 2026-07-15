import { ADD_PRODUCT, DELETE_PRODUCT } from './actionTypes'
import type { CartAction, CartActionPayload } from '../../../interface'

// For add Item to Cart
export const ADDCART = (product: CartActionPayload): CartAction => {
  return {
    type: ADD_PRODUCT,
    payload: product,
  }
}

// For remove Item from Cart
export const DELETECART = (product: CartActionPayload): CartAction => {
  return {
    type: DELETE_PRODUCT,
    payload: product,
  }
}
