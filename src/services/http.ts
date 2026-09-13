import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_BASE_URL, FORCE_MOCK } from '../common/constants'
import { getErrorMessage } from '../common/utils/errorMessage'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getSessionToken,
  setAccessToken,
} from '../common/utils/session'
import { toast } from '../common/utils/toast'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
})

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
  }
  config.headers = { ...config.headers, 'x-session-token': getSessionToken() }
  return config
})

let refreshInFlight: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const res = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
    )
    setAccessToken(res.data.accessToken)
    window.localStorage.setItem('fs.refreshToken', res.data.refreshToken)
    return res.data.accessToken
  } catch {
    clearSession()
    return null
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { friendlyMessage?: string; config?: RetriableConfig }) => {
    const config = error.config as RetriableConfig | undefined

    if (error.response?.status === 401 && config && !config._retried && getRefreshToken()) {
      config._retried = true
      refreshInFlight = refreshInFlight ?? refreshAccessToken()
      const token = await refreshInFlight
      refreshInFlight = null

      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
        return http.request(config)
      }
    }

    error.friendlyMessage = getErrorMessage(error)
    if (!config?.silentError && !isOffline(error)) {
      toast.error(error.friendlyMessage)
    }
    return Promise.reject(error)
  },
)

interface RetriableConfig extends AxiosRequestConfig {
  _retried?: boolean
  silentError?: boolean
}

export const isOffline = (error: unknown): boolean => {
  const axiosError = error as AxiosError | undefined
  if (!axiosError) return false
  if (axiosError.response) return false
  return Boolean(axiosError.request) || axiosError.code === 'ECONNABORTED'
}

const OFFLINE_COOLDOWN_MS = 20_000
let offlineUntil = 0

export const isUsingMockData = (): boolean => FORCE_MOCK || Date.now() < offlineUntil
export const markOffline = (): void => {
  offlineUntil = Date.now() + OFFLINE_COOLDOWN_MS
}
export const resetOfflineState = (): void => {
  offlineUntil = 0
}

let offlineNoticeShownAt = 0

const announceOffline = (): void => {
  if (Date.now() - offlineNoticeShownAt < OFFLINE_COOLDOWN_MS) return
  offlineNoticeShownAt = Date.now()
  toast.warning('Cannot reach the server, showing sample data.')
}

export async function withFallback<T>(
  request: () => Promise<AxiosResponse<T>>,
  mock: () => T | Promise<T>,
): Promise<T> {
  if (isUsingMockData()) {
    return mock()
  }

  try {
    const response = await request()
    return response.data
  } catch (error) {
    if (isOffline(error)) {
      markOffline()
      announceOffline()
      return mock()
    }
    throw error
  }
}

export async function unwrapPage<T>(
  request: () => Promise<AxiosResponse<{ data: T[] }>>,
): Promise<AxiosResponse<T[]>> {
  const response = await request()
  return { ...response, data: response.data.data }
}

export async function apiOnly<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
  const response = await request()
  return response.data
}

export default http
