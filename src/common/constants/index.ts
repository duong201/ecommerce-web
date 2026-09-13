export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8801'

export const FORCE_MOCK = process.env.REACT_APP_USE_MOCK === 'true'

export const NO_IMAGE_URL = 'https://i.ibb.co/QD28mw2/no-image.jpg'
export const DEFAULT_AVATAR_URL = 'https://i.ibb.co/0BfNrCb/product-1.jpg'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'fs.accessToken',
  REFRESH_TOKEN: 'fs.refreshToken',
  USER: 'fs.user',
  SESSION_TOKEN: 'fs.sessionToken',
}

export const ROLE_ID = {
  CUSTOMER: 1,
  MANAGER: 2,
  ADMIN: 3,
} as const

export const DELIVERY_FEE_AMOUNT = 25_000
export const FREE_DELIVERY_THRESHOLD = 300_000
