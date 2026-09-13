import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'fs.theme'

const read = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

/**
 * Light/dark preference. "system" leaves the root element unstamped so the
 * `prefers-color-scheme` block in `_base.scss` decides; an explicit choice
 * stamps `data-theme` so the toggle wins in both directions.
 */
export const useTheme = () => {
  const [preference, setPreference] = useState<ThemePreference>(read)

  useEffect(() => {
    const root = document.documentElement
    if (preference === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', preference)
    }

    try {
      if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY)
      else window.localStorage.setItem(STORAGE_KEY, preference)
    } catch {
      /* storage can be blocked; the in-memory preference still applies */
    }
  }, [preference])

  const resolved: 'light' | 'dark' =
    preference === 'system'
      ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : preference

  const toggle = useCallback(() => {
    setPreference((current) => {
      const isDark =
        current === 'dark' ||
        (current === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
      return isDark ? 'light' : 'dark'
    })
  }, [])

  return { preference, resolved, setPreference, toggle }
}

/**
 * Applies the stored preference before React renders, so a dark-mode user never
 * sees a white flash. Called once from the app entry point.
 */
export const applyStoredTheme = (): void => {
  const preference = read()
  if (preference !== 'system') {
    document.documentElement.setAttribute('data-theme', preference)
  }
}

export default useTheme
