import { useCallback, useEffect, useState } from 'react'

/**
 * Runs `fetcher()` once per change of `deps` and keeps the result in state.
 * Guards against setting state after the component/deps have moved on,
 * which is what caused the infinite fetch loops this hook replaces.
 */
export const useFetch = (fetcher, deps = [], initialValue = []) => {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
