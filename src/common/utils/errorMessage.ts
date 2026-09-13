import i18n from '../../i18n'
import { HTTP_STATUS_KEYS, isErrorCode } from '../constants/errorCodes'

interface ErrorResponseData {
  code?: string
  message?: string
}

interface ErrorLike {
  response?: {
    status?: number
    data?: unknown
  }
  request?: unknown
  message?: string
}

const fallback = (): string => i18n.t('errors.default')

export const getErrorMessageFromCode = (
  code?: string | null,
  fallbackMessage?: string | null,
): string => {
  if (isErrorCode(code)) return i18n.t(`errors.codes.${code}`)
  return fallbackMessage || fallback()
}

export const getErrorMessage = (error?: ErrorLike | null): string => {
  if (!error) return fallback()

  const responseData = error.response?.data as ErrorResponseData | undefined
  if (isErrorCode(responseData?.code)) return i18n.t(`errors.codes.${responseData!.code}`)
  if (responseData?.message) return responseData.message

  const status = error.response?.status
  if (status && status in HTTP_STATUS_KEYS) return i18n.t(HTTP_STATUS_KEYS[status])

  if (error.request && !error.response) return i18n.t('errors.codes.NETWORK_ERROR')

  return fallback()
}
