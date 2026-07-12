import {
  DEFAULT_ERROR_MESSAGE,
  ERROR_CODE_MESSAGES,
  HTTP_STATUS_MESSAGES,
} from '../constants/errorCodes'

/**
 * Maps a backend error `code` to its Vietnamese display text.
 * Falls back to `fallbackMessage` (e.g. a raw message from the API), then to the generic default.
 */
export const getErrorMessageFromCode = (code, fallbackMessage) => {
  if (code && ERROR_CODE_MESSAGES[code]) return ERROR_CODE_MESSAGES[code]
  return fallbackMessage || DEFAULT_ERROR_MESSAGE
}

/**
 * Resolves a display message for a failed axios request (network error, HTTP error, ...).
 * Priority: known error `code` from the response body > raw `message` from the response body >
 * a message for the HTTP status > network-error message > generic default.
 */
export const getErrorMessage = (error) => {
  if (!error) return DEFAULT_ERROR_MESSAGE

  const responseData = error.response?.data
  if (responseData?.code && ERROR_CODE_MESSAGES[responseData.code]) {
    return ERROR_CODE_MESSAGES[responseData.code]
  }
  if (responseData?.message) return responseData.message

  const status = error.response?.status
  if (status && HTTP_STATUS_MESSAGES[status]) return HTTP_STATUS_MESSAGES[status]

  if (error.request && !error.response) return ERROR_CODE_MESSAGES.NETWORK_ERROR

  return DEFAULT_ERROR_MESSAGE
}
