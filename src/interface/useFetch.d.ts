import type { Dispatch, SetStateAction } from 'react'

export interface UseFetchResult<T> {
  data: T
  setData: Dispatch<SetStateAction<T>>
  loading: boolean
  error: unknown
  refetch: () => () => void
}
