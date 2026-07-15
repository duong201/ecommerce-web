// This redux slice is vestigial (no component reads `state.handleCart` or
// dispatches these actions — the real cart flow goes through common/api/carts.ts),
// so the payload is modeled loosely rather than as a full `Product`.
export interface CartActionPayload {
  id: number
  [key: string]: unknown
}

export interface CartReduxItem extends CartActionPayload {
  qty: number
}

export type CartReduxState = CartReduxItem[]

export interface CartAction {
  type: string
  // Optional to also accommodate redux's internal `@@redux/INIT` action, which carries no payload.
  payload?: CartActionPayload
}
