import {
  DEFAULT_ERROR_MESSAGE,
  ERROR_CODE_MESSAGES,
  HTTP_STATUS_MESSAGES,
} from '../constants/errorCodes'

type ErrorCode = keyof typeof ERROR_CODE_MESSAGES

interface ErrorResponseData {
  code?: string
  message?: string
}

// Deliberately loose (not `AxiosError`) so it also accepts the plain-object
// fixtures tests use and any other thrown value a `.catch` might receive.
interface ErrorLike {
  response?: {
    status?: number
    data?: unknown
  }
  request?: unknown
  message?: string
}

/**
 * Maps a backend error `code` to its Vietnamese display text.
 * Falls back to `fallbackMessage` (e.g. a raw message from the API), then to the generic default.
 */
export const getErrorMessageFromCode = (
  code?: string | null,
  fallbackMessage?: string | null,
): string => {
  if (code && code in ERROR_CODE_MESSAGES) return ERROR_CODE_MESSAGES[code as ErrorCode]
  return fallbackMessage || DEFAULT_ERROR_MESSAGE
}

/**
 * Resolves a display message for a failed axios request (network error, HTTP error, ...).
 * Priority: known error `code` from the response body > raw `message` from the response body >
 * a message for the HTTP status > network-error message > generic default.
 */
export const getErrorMessage = (error?: ErrorLike | null): string => {
  if (!error) return DEFAULT_ERROR_MESSAGE

  const responseData = error.response?.data as ErrorResponseData | undefined
  if (responseData?.code && responseData.code in ERROR_CODE_MESSAGES) {
    return ERROR_CODE_MESSAGES[responseData.code as ErrorCode]
  }
  if (responseData?.message) return responseData.message

  const status = error.response?.status
  if (status && status in HTTP_STATUS_MESSAGES) {
    return HTTP_STATUS_MESSAGES[status as keyof typeof HTTP_STATUS_MESSAGES]
  }

  if (error.request && !error.response) return ERROR_CODE_MESSAGES.NETWORK_ERROR

  return DEFAULT_ERROR_MESSAGE
}
