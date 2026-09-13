import path from 'node:path'
import { test } from '@playwright/test'
import { BREAKPOINTS, ROUTES, SHOT_THEMES } from './targets'
import { open, pinTheme, storageStateFor } from './helpers'

/**
 * A full-page screenshot of every route, at each of the three breakpoints.
 * Files land in `visual/out/screens/<theme>/<breakpoint>/<page>.png`, so the
 * same page across widths sits in three matching filenames.
 */

const SHOT_DIR = path.join(__dirname, 'out', 'screens')

for (const theme of SHOT_THEMES) {
  for (const breakpoint of BREAKPOINTS) {
    test.describe(`${breakpoint.name} (${breakpoint.width}px) · ${theme}`, () => {
      test.use({ viewport: { width: breakpoint.width, height: breakpoint.height } })

      for (const route of ROUTES) {
        // Grouped by audience so `test.use` can hand each its own session.
        test.describe(route.as, () => {
          test.use({ storageState: storageStateFor(route.as) })

          test(route.title, async ({ page }) => {
            await pinTheme(page, theme)
            await open(page, route.path)

            await page.screenshot({
              path: path.join(SHOT_DIR, theme, breakpoint.name, `${route.id}.png`),
              fullPage: true,
              animations: 'disabled',
            })
          })
        })
      }
    })
  }
}
