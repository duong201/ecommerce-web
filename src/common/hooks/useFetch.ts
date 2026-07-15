import { useCallback, useEffect, useState } from 'react'
import type { AxiosResponse } from 'axios'
import type { UseFetchResult } from '../../interface'

/**
 * Runs `fetcher()` once per change of `deps` and keeps the result in state.
 * Guards against setting state after the component/deps have moved on,
 * which is what caused the infinite fetch loops this hook replaces.
 */
export const useFetch = <T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  deps: React.DependencyList = [],
  initialValue = [] as unknown as T,
): UseFetchResult<T> => {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const load = useCallback(() => {
    let active = true
    setLoading(true)
    fetcher()
      .then((res) => {
        if (active) setData(res.data)
      })
      .catch((err) => {
        if (active) setError(err)
        console.error(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => load(), [load])

  return { data, setData, loading, error, refetch: load }
}
