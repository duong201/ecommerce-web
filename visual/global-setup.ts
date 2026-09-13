import fs from 'node:fs'
import path from 'node:path'
import { chromium, type FullConfig } from '@playwright/test'
import { RAW_DIR } from './contrast'

/**
 * Signs in once per role through the real form and parks the resulting
 * localStorage in `visual/.auth`, so the specs can open a guarded page directly
 * instead of walking the login screen fifty-odd times.
 */

/** Accounts and password come from `src/services/mock/dataset.ts`. */
const ACCOUNTS = {
  customer: { identifier: 'khach@shop.vn', landsOn: '/' },
  admin: { identifier: 'admin@shop.vn', landsOn: '/admin' },
} as const

type Role = keyof typeof ACCOUNTS

const PASSWORD = '123456'

export const authFile = (role: Role): string => path.join(__dirname, '.auth', `${role}.json`)

const globalSetup = async (config: FullConfig): Promise<void> => {
  const baseURL = config.projects[0]?.use.baseURL
  if (!baseURL) throw new Error('No baseURL configured; cannot sign in.')

  // A stale finding from a previous run must not reach this run's report.
  fs.rmSync(RAW_DIR, { recursive: true, force: true })
  fs.mkdirSync(path.join(__dirname, '.auth'), { recursive: true })

  const browser = await chromium.launch()

  try {
    for (const role of Object.keys(ACCOUNTS) as Role[]) {
      const account = ACCOUNTS[role]
      const context = await browser.newContext({ baseURL })
      const page = await context.newPage()

      await page.goto('/dang-nhap')
      await page.getByLabel(/^Email or phone number/).fill(account.identifier)
      await page.getByLabel(/^Password/).fill(PASSWORD)
      await page.getByRole('button', { name: 'Sign in' }).click()

      // The form only leaves /dang-nhap once the session is in storage.
      await page.waitForURL((url) => url.pathname === account.landsOn, { timeout: 20_000 })

      await context.storageState({ path: authFile(role) })
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

export default globalSetup
