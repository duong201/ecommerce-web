import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFetchResult } from '../../interface'

export const useFetch = <T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  initialValue = [] as unknown as T,
): UseFetchResult<T> => {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const load = useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)

    fetcherRef
      .current()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(err)
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

export default useFetch
