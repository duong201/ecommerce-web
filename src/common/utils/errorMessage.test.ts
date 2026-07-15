import { getErrorMessage, getErrorMessageFromCode } from './errorMessage'
import { ERROR_CODE_MESSAGES, DEFAULT_ERROR_MESSAGE } from '../constants/errorCodes'

describe('getErrorMessageFromCode', () => {
  it('maps a known code to its Vietnamese text', () => {
    expect(getErrorMessageFromCode('INVALID_CREDENTIALS')).toBe(
      ERROR_CODE_MESSAGES.INVALID_CREDENTIALS,
    )
  })

  it('falls back to the given message when the code is unknown', () => {
    expect(getErrorMessageFromCode('SOME_UNKNOWN_CODE', 'Lỗi từ server')).toBe('Lỗi từ server')
  })

  it('falls back to the default message when there is no code and no fallback', () => {
    expect(getErrorMessageFromCode(undefined, undefined)).toBe(DEFAULT_ERROR_MESSAGE)
  })
})

describe('getErrorMessage', () => {
  it('prefers a known error code from the response body', () => {
    const error = {
      response: { status: 400, data: { code: 'INVALID_COUPON', message: 'raw message' } },
    }
    expect(getErrorMessage(error)).toBe(ERROR_CODE_MESSAGES.INVALID_COUPON)
  })

  it('falls back to the raw response message when the code is unknown', () => {
    const error = {
      response: { status: 400, data: { code: 'NOT_A_REAL_CODE', message: 'Địa chỉ không hợp lệ' } },
    }
    expect(getErrorMessage(error)).toBe('Địa chỉ không hợp lệ')
  })

  it('falls back to a status-based message when there is no code or message', () => {
    const error = { response: { status: 404, data: {} } }
    expect(getErrorMessage(error)).toBe(ERROR_CODE_MESSAGES.NOT_FOUND)
  })

  it('returns the network-error message when the request never got a response', () => {
    const error = { request: {}, response: undefined }
    expect(getErrorMessage(error)).toBe(ERROR_CODE_MESSAGES.NETWORK_ERROR)
  })

  it('returns the default message for a plain Error with no response/request', () => {
    expect(getErrorMessage(new Error('boom'))).toBe(DEFAULT_ERROR_MESSAGE)
  })

  it('returns the default message when called without an error', () => {
    expect(getErrorMessage(undefined)).toBe(DEFAULT_ERROR_MESSAGE)
  })
})
