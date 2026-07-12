import { ADD_PRODUCT, DELETE_PRODUCT } from '../action/actionTypes'

const cart = []

const handleCart = (state = cart, action) => {
  const product = action.payload

  switch (action.type) {
    case ADD_PRODUCT: {
      const exist = state.find((key) => key.id === product.id)
      if (exist) {
        return state.map((key) => (key.id === product.id ? { ...key, qty: key.qty + 1 } : key))
      }
      return [...state, { ...product, qty: 1 }]
    }

    case DELETE_PRODUCT: {
      const exist = state.find((key) => key.id === product.id)
      if (!exist) {
        return state
      }
      if (exist.qty === 1) {
        return state.filter((key) => key.id !== exist.id)
      }
      return state.map((key) => (key.id === product.id ? { ...key, qty: key.qty - 1 } : key))
    }

    default:
      return state
  }
}

export default handleCart
