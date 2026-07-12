import { ADD_PRODUCT, DELETE_PRODUCT } from './actionTypes'

// For add Item to Cart
export const ADDCART = (product) => {
  return {
    type: ADD_PRODUCT,
    payload: product,
  }
}

// For remove Item from Cart
export const DELETECART = (product) => {
  return {
    type: DELETE_PRODUCT,
    payload: product,
  }
}
