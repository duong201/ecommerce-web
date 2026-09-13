export const ERROR_CODES = [
  'INVALID_CREDENTIALS',
  'USER_NOT_FOUND',
  'USERNAME_EXISTS',
  'EMAIL_EXISTS',
  'PHONE_EXISTS',
  'INVALID_COUPON',
  'COUPON_EXPIRED',
  'COUPON_NOT_APPLICABLE',
  'OUT_OF_STOCK',
  'PRODUCT_NOT_FOUND',
  'CART_ITEM_NOT_FOUND',
  'VALIDATION_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'SERVER_ERROR',
  'NETWORK_ERROR',
  'TIMEOUT',
] as const

export type ErrorCode = (typeof ERROR_CODES)[number]

export const isErrorCode = (value?: string | null): value is ErrorCode =>
  Boolean(value) && (ERROR_CODES as readonly string[]).includes(value as string)

export const HTTP_STATUS_KEYS: Record<number, string> = {
  400: 'errors.http.400',
  401: 'errors.codes.UNAUTHORIZED',
  403: 'errors.codes.FORBIDDEN',
  404: 'errors.codes.NOT_FOUND',
  409: 'errors.http.409',
  422: 'errors.codes.VALIDATION_ERROR',
  500: 'errors.codes.SERVER_ERROR',
  502: 'errors.codes.SERVER_ERROR',
  503: 'errors.codes.SERVER_ERROR',
}
