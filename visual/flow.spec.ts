import path from 'node:path'
import { expect, test, type Locator } from '@playwright/test'
import {
  BREAKPOINTS,
  CONTRAST_THEMES,
  SAMPLE_PRODUCT_SLUG,
  SHOT_THEMES,
  type Theme,
} from './targets'
import { auditContrast } from './contrast'
import { open, pinTheme, settle, storageStateFor } from './helpers'

/**
 * Cart, checkout and the order confirmation only hold content once something
 * has been bought, and the offline store keeps that state in memory — a reload
 * empties it. So these three pages are reached by walking the real flow in one
 * session, with client-side navigation only, rather than by `goto`.
 */

const SHOT_DIR = path.join(__dirname, 'out', 'screens')

/** Every theme either output needs; each gets one walk through the flow. */
const FLOW_THEMES: Theme[] = Array.from(new Set([...SHOT_THEMES, ...CONTRAST_THEMES]))

/** The checkout prefills from the session, so only top up what is still blank. */
const fillIfEmpty = async (field: Locator, value: string): Promise<void> => {
  if ((await field.inputValue()).trim() === '') await field.fill(value)
}

for (const theme of FLOW_THEMES) {
  for (const breakpoint of BREAKPOINTS) {
    test.describe(`${breakpoint.name} (${breakpoint.width}px) · ${theme}`, () => {
      test.use({
        viewport: { width: breakpoint.width, height: breakpoint.height },
        storageState: storageStateFor('customer'),
      })

      test('Cart, checkout and order confirmation', async ({ page }, testInfo) => {
        const capture = async (id: string, title: string) => {
          await settle(page)

          if (SHOT_THEMES.includes(theme)) {
            await page.screenshot({
              path: path.join(SHOT_DIR, theme, breakpoint.name, `${id}.png`),
              fullPage: true,
              animations: 'disabled',
            })
          }

          if (CONTRAST_THEMES.includes(theme)) {
            await auditContrast(
              page,
              {
                page: id,
                title,
                path: new URL(page.url()).pathname,
                theme,
                breakpoint: breakpoint.name,
                width: breakpoint.width,
              },
              testInfo,
            )
          }
        }

        await pinTheme(page, theme)
        await open(page, `/san-pham/${SAMPLE_PRODUCT_SLUG}`)

        await page.getByRole('button', { name: 'Add to cart' }).click()
        // The header badge only refetches on mount, so the toast is what
        // actually confirms the line reached the cart.
        await expect(page.getByText(/added to the cart/i)).toBeVisible()

        await page.getByRole('link', { name: 'Cart' }).click()
        await expect(page.getByTestId('cart-line').first()).toBeVisible()
        await capture('cart-filled', 'Cart with items')

        await page.getByRole('button', { name: 'Checkout' }).click()
        await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()

        await fillIfEmpty(page.getByLabel(/^Full name[*]?$/), 'Nguyễn Văn A')
        await fillIfEmpty(page.getByLabel(/^Phone number[*]?$/), '0912345678')
        await fillIfEmpty(page.getByLabel(/^Recipient[*]?$/), 'Nguyễn Văn A')
        await fillIfEmpty(page.getByLabel(/^Recipient phone[*]?$/), '0912345678')
        await fillIfEmpty(page.getByLabel(/^Street address[*]?$/), '12 Nguyễn Huệ')
        await fillIfEmpty(page.getByLabel(/^Ward[*]?$/), 'Bến Nghé')
        await fillIfEmpty(page.getByLabel(/^District[*]?$/), 'Quận 1')
        await fillIfEmpty(page.getByLabel(/^Province or city[*]?$/), 'TP Hồ Chí Minh')

        // First slot still taking orders; `disabled` marks the full ones.
        await page.locator('.slot-option:not([disabled])').first().click()
        await capture('checkout-filled', 'Checkout with a full basket')

        await page.getByRole('button', { name: 'Place order' }).click()
        await page.waitForURL(/\/dat-hang-thanh-cong\//)
        await capture('order-success', 'Order confirmation')

        // Client-side only: a reload would empty the in-memory offline store.
        await page.getByRole('link', { name: 'View my orders' }).click()
        await page.waitForURL((url) => url.pathname === '/don-hang')
        await capture('my-orders-filled', 'My orders with an order')
      })
    })
  }
}
