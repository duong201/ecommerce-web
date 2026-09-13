import type { Page } from '@playwright/test'
import type { Audience, Theme } from './targets'
import { authFile } from './global-setup'

/**
 * The signed-in state a page needs, as a Playwright `storageState` value. Guests
 * get an explicitly empty state rather than `undefined`, which `test.use` would
 * read as "inherit whatever the parent had".
 */
export const storageStateFor = (audience: Audience): string | { cookies: []; origins: [] } =>
  audience === 'guest' ? { cookies: [], origins: [] } : authFile(audience)

/**
 * Pins the theme before the app's first paint. `applyStoredTheme` reads this key
 * and stamps `data-theme`, which is what the stylesheet keys off; the media
 * emulation keeps any `prefers-color-scheme` rule agreeing with it.
 */
export const pinTheme = async (page: Page, theme: Theme): Promise<void> => {
  await page.emulateMedia({ colorScheme: theme })
  await page.addInitScript((value) => {
    try {
      window.localStorage.setItem('fs.theme', value)
    } catch {
      /* storage can be blocked; the media emulation still applies */
    }
  }, theme)
}

/**
 * Waits for the page to stop moving: fonts loaded, lazy images triggered by a
 * full scroll, images decoded, animations frozen. Without this a full-page
 * screenshot catches half-loaded art and axe measures a colour mid-transition.
 */
export const settle = async (page: Page): Promise<void> => {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      caret-color: transparent !important;
    }
    html { scroll-behavior: auto !important; }`,
  })

  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, 0)

    if (document.fonts) await document.fonts.ready

    await Promise.all(
      Array.from(document.images).map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              // A broken image must not hang the run.
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener('error', () => resolve(), { once: true })
              setTimeout(resolve, 5000)
            }),
      ),
    )
  })

  await page.waitForTimeout(250)
}

/** Opens a route and waits for it to be ready to photograph or audit. */
export const open = async (page: Page, path: string): Promise<void> => {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  // Loading skeletons resolve on the next tick in offline mode.
  await page.waitForLoadState('networkidle').catch(() => undefined)
  await settle(page)
}
