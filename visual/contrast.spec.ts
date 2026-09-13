import { test } from '@playwright/test'
import { BREAKPOINTS, CONTRAST_THEMES, ROUTES } from './targets'
import { auditContrast } from './contrast'
import { open, pinTheme, storageStateFor } from './helpers'

/**
 * Contrast is measured at every breakpoint because layout decides which text
 * sits on which background, and in both themes because the dark palette is a
 * separate set of tokens that nothing else checks.
 */

for (const theme of CONTRAST_THEMES) {
  for (const breakpoint of BREAKPOINTS) {
    test.describe(`${breakpoint.name} (${breakpoint.width}px) · ${theme}`, () => {
      test.use({ viewport: { width: breakpoint.width, height: breakpoint.height } })

      for (const route of ROUTES) {
        // Grouped by audience so `test.use` can hand each its own session.
        test.describe(route.as, () => {
          test.use({ storageState: storageStateFor(route.as) })

          test(route.title, async ({ page }, testInfo) => {
            await pinTheme(page, theme)
            await open(page, route.path)

            await auditContrast(
              page,
              {
                page: route.id,
                title: route.title,
                path: route.path,
                theme,
                breakpoint: breakpoint.name,
                width: breakpoint.width,
              },
              testInfo,
            )
          })
        })
      }
    })
  }
}
