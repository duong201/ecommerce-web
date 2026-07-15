import { SESSION_KEYS } from '../constants'

export const getCurrentUserId = (): string | null => sessionStorage.getItem(SESSION_KEYS.USER_ID)
export const getCurrentUserName = (): string | null =>
  sessionStorage.getItem(SESSION_KEYS.USER_NAME)
export const getCurrentAdminId = (): string | null => sessionStorage.getItem(SESSION_KEYS.ADMIN_ID)
export const getCurrentAdminName = (): string | null =>
  sessionStorage.getItem(SESSION_KEYS.ADMIN_NAME)

export const setUserSession = (id: string | number, name: string): void => {
  sessionStorage.setItem(SESSION_KEYS.USER_ID, String(id))
  sessionStorage.setItem(SESSION_KEYS.USER_NAME, name)
}

export const setAdminSession = (id: string | number, name: string): void => {
  sessionStorage.setItem(SESSION_KEYS.ADMIN_ID, String(id))
  sessionStorage.setItem(SESSION_KEYS.ADMIN_NAME, name)
}

export const clearUserSession = (): void => {
  sessionStorage.removeItem(SESSION_KEYS.USER_ID)
  sessionStorage.removeItem(SESSION_KEYS.USER_NAME)
}

export const clearAdminSession = (): void => {
  sessionStorage.removeItem(SESSION_KEYS.ADMIN_ID)
  sessionStorage.removeItem(SESSION_KEYS.ADMIN_NAME)
}
