export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8801'

export const NO_IMAGE_URL = 'https://i.ibb.co/QD28mw2/no-image.jpg'
export const DEFAULT_AVATAR_URL = 'https://i.ibb.co/0BfNrCb/product-1.jpg'

export const SESSION_KEYS = {
  USER_ID: 'id',
  USER_NAME: 'name',
  ADMIN_ID: 'idAdmin',
  ADMIN_NAME: 'adminName',
}

export const USER_LEVEL = {
  ADMIN: 0,
  CUSTOMER: 1,
}
