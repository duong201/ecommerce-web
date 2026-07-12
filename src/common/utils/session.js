import { SESSION_KEYS } from '../constants'

export const getCurrentUserId = () => sessionStorage.getItem(SESSION_KEYS.USER_ID)
export const getCurrentUserName = () => sessionStorage.getItem(SESSION_KEYS.USER_NAME)
export const getCurrentAdminId = () => sessionStorage.getItem(SESSION_KEYS.ADMIN_ID)
export const getCurrentAdminName = () => sessionStorage.getItem(SESSION_KEYS.ADMIN_NAME)

export const setUserSession = (id, name) => {
  sessionStorage.setItem(SESSION_KEYS.USER_ID, id)
  sessionStorage.setItem(SESSION_KEYS.USER_NAME, name)
}

export const setAdminSession = (id, name) => {
  sessionStorage.setItem(SESSION_KEYS.ADMIN_ID, id)
  sessionStorage.setItem(SESSION_KEYS.ADMIN_NAME, name)
}

export const clearUserSession = () => {
  sessionStorage.removeItem(SESSION_KEYS.USER_ID)
  sessionStorage.removeItem(SESSION_KEYS.USER_NAME)
}

export const clearAdminSession = () => {
  sessionStorage.removeItem(SESSION_KEYS.ADMIN_ID)
  sessionStorage.removeItem(SESSION_KEYS.ADMIN_NAME)
}
