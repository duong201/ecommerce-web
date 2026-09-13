import { ROLE_ID, STORAGE_KEYS } from '../constants'
import type { AuthSession, RoleId, User } from '../../interface'

type SessionUser = AuthSession['user']

const read = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const write = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value)
  } catch {}
}

const remove = (key: string): void => {
  try {
    window.localStorage.removeItem(key)
  } catch {}
}

export const getAccessToken = (): string | null => read(STORAGE_KEYS.ACCESS_TOKEN)
export const getRefreshToken = (): string | null => read(STORAGE_KEYS.REFRESH_TOKEN)

export const getCurrentUser = (): SessionUser | null => {
  const raw = read(STORAGE_KEYS.USER)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export const getCurrentUserId = (): string | null => getCurrentUser()?.id ?? null
export const getCurrentUserName = (): string | null => getCurrentUser()?.fullName ?? null
export const getCurrentRoleId = (): RoleId | null => getCurrentUser()?.roleId ?? null

export const isLoggedIn = (): boolean => Boolean(getAccessToken() && getCurrentUser())

export const isStaff = (): boolean => (getCurrentRoleId() ?? 0) >= ROLE_ID.MANAGER
export const isAdmin = (): boolean => getCurrentRoleId() === ROLE_ID.ADMIN

export const saveSession = (session: AuthSession): void => {
  write(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken)
  write(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken)
  write(STORAGE_KEYS.USER, JSON.stringify(session.user))
}

export const updateStoredUser = (user: Partial<User>): void => {
  const current = getCurrentUser()
  if (!current) return
  write(STORAGE_KEYS.USER, JSON.stringify({ ...current, ...user }))
}

export const setAccessToken = (token: string): void => write(STORAGE_KEYS.ACCESS_TOKEN, token)

export const clearSession = (): void => {
  remove(STORAGE_KEYS.ACCESS_TOKEN)
  remove(STORAGE_KEYS.REFRESH_TOKEN)
  remove(STORAGE_KEYS.USER)
}

export const getSessionToken = (): string => {
  const existing = read(STORAGE_KEYS.SESSION_TOKEN)
  if (existing) return existing

  const generated = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  write(STORAGE_KEYS.SESSION_TOKEN, generated)
  return generated
}

export const clearSessionToken = (): void => remove(STORAGE_KEYS.SESSION_TOKEN)
