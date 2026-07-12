import { renderHook, waitFor, act } from '@testing-library/react'
import { useFetch } from './useFetch'
import { mockApiResponse } from '../../test-utils/mockApiResponse'

describe('useFetch', () => {
  it('starts in a loading state with the initial value', () => {
    const fetcher = jest.fn(() => mockApiResponse([]))
    const { result } = renderHook(() => useFetch(fetcher, [], []))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toEqual([])
  })

  it('populates data from the resolved response and clears loading', async () => {
    const products = [{ id: 1, name: 'Áo thun' }]
    const fetcher = jest.fn(() => mockApiResponse(products))
    const { result } = renderHook(() => useFetch(fetcher, []))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual(products)
    expect(result.current.error).toBeNull()
  })

  it('captures a rejected fetch as an error and logs it', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('network down')
    const fetcher = jest.fn(() => Promise.reject(failure))
    const { result } = renderHook(() => useFetch(fetcher, []))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe(failure)
    consoleError.mockRestore()
  })

  it('re-runs the fetcher when deps change', async () => {
    const fetcher = jest.fn((id) => mockApiResponse({ id }))
    const { result, rerender } = renderHook(
      ({ id }) => useFetch(() => fetcher(id), [id], {}),
      { initialProps: { id: 1 } }
    )

    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }))

    rerender({ id: 2 })
    await waitFor(() => expect(result.current.data).toEqual({ id: 2 }))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('refetch triggers the fetcher again and updates data', async () => {
    const fetcher = jest.fn()
      .mockReturnValueOnce(mockApiResponse([1]))
      .mockReturnValueOnce(mockApiResponse([1, 2]))
    const { result } = renderHook(() => useFetch(fetcher, []))

    await waitFor(() => expect(result.current.data).toEqual([1]))

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => expect(result.current.data).toEqual([1, 2]))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('setData allows optimistic local updates', async () => {
    const fetcher = jest.fn(() => mockApiResponse([{ id: 1 }]))
    const { result } = renderHook(() => useFetch(fetcher, []))

    await waitFor(() => expect(result.current.data).toEqual([{ id: 1 }]))

    act(() => {
      result.current.setData((current) => current.filter((item) => item.id !== 1))
    })

    expect(result.current.data).toEqual([])
  })
})
